#!/usr/bin/env node
/**
 * Retry failed geocode entries by simplifying Malaysian addresses to
 * a postcode + city + state form, which Nominatim handles far better
 * than full shop addresses with lot numbers.
 *
 * Run: node scripts/geocode-retry.mjs
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = resolve(__dirname, '..', 'geocode-cache.json');
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1vw2xxD83jNNkhuGQd-NYQBctMsVSxOF7M7D7hfdTtvg/export?format=csv&gid=1276340913';
const USER_AGENT = 'tayarlo-dealer-locator/1.0 (https://www.tayarlo.com)';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const REQUEST_INTERVAL_MS = 2500;

const MALAYSIAN_STATES = [
  'Selangor', 'Kuala Lumpur', 'Putrajaya', 'Penang', 'Pulau Pinang',
  'Johor', 'Perak', 'Kedah', 'Kelantan', 'Terengganu', 'Pahang',
  'Negeri Sembilan', 'Melaka', 'Malacca', 'Perlis', 'Sabah', 'Sarawak',
  'Labuan',
];

function addressHash(a) {
  return createHash('sha1').update(a.replace(/\s+/g, ' ').trim().toLowerCase()).digest('hex').slice(0, 16);
}
function parseRow(line) {
  const out = []; let f = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { out.push(f); f = ''; }
    else f += c;
  }
  out.push(f); return out;
}
function parseCSV(text) {
  // robust line-aware parser preserving quoted newlines
  const rows = []; let cur = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { f += '"'; i++; }
      else if (c === '"') q = false;
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { cur.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      cur.push(f); rows.push(cur); cur = []; f = '';
    } else f += c;
  }
  if (f.length || cur.length) { cur.push(f); rows.push(cur); }
  return rows;
}

function buildFallbackQueries(addr, area, state) {
  const queries = [];
  const postcodeMatch = addr.match(/\b(\d{5})\b/);
  const postcode = postcodeMatch ? postcodeMatch[1] : null;

  // Detect a state name in the address text, even if column is empty.
  let stateGuess = state;
  if (!stateGuess) {
    for (const s of MALAYSIAN_STATES) {
      if (addr.toLowerCase().includes(s.toLowerCase())) { stateGuess = s; break; }
    }
  }

  // Try: "<area>, <state>, Malaysia"
  if (area && stateGuess) queries.push(`${area}, ${stateGuess}, Malaysia`);
  // Try: postcode + state
  if (postcode && stateGuess) queries.push(`${postcode} ${stateGuess}, Malaysia`);
  // Try: postcode + area
  if (postcode && area) queries.push(`${postcode} ${area}, Malaysia`);
  // Try: postcode alone
  if (postcode) queries.push(`${postcode}, Malaysia`);
  // Try: area alone
  if (area) queries.push(`${area}, Malaysia`);
  // Try: state alone
  if (stateGuess) queries.push(`${stateGuess}, Malaysia`);

  return [...new Set(queries)];
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function geocodeQuery(q) {
  const params = new URLSearchParams({
    q, format: 'jsonv2', limit: '1', countrycodes: 'my',
  });
  const res = await fetch(`${NOMINATIM_BASE}?${params}`, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`nominatim ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || !data.length) return null;
  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

async function main() {
  console.log('Fetching sheet…');
  const csv = await fetch(SHEET_CSV_URL).then(r => r.text());
  const rows = parseCSV(csv);

  // Find header row
  let headerIdx = -1;
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const cells = rows[i].map(c => c.trim().toLowerCase());
    if (cells.includes('name') && (cells.includes('state') || cells.includes('area'))) {
      headerIdx = i; break;
    }
  }
  if (headerIdx === -1) throw new Error('no header');
  const header = rows[headerIdx].map(c => c.trim().toLowerCase());
  const colName = header.indexOf('name');
  const colAddr = header.findIndex(h => h === 'shop full address' || h === 'address');
  const colArea = header.indexOf('area');
  const colState = header.indexOf('state');

  const cache = JSON.parse(await readFile(CACHE_PATH, 'utf8'));

  const failed = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const name = (r[colName] || '').trim();
    const addr = (r[colAddr] || '').trim();
    if (!name || !addr) continue;
    const key = addressHash(addr);
    const e = cache[key];
    if (e && e.failed) {
      failed.push({
        key, name, addr,
        area: (r[colArea] || '').trim(),
        state: (r[colState] || '').trim(),
      });
    }
  }

  console.log(`Retrying ${failed.length} failed entries…`);
  let recovered = 0;
  for (let i = 0; i < failed.length; i++) {
    const { key, name, addr, area, state } = failed[i];
    const queries = buildFallbackQueries(addr, area, state);
    process.stdout.write(`[${i + 1}/${failed.length}] ${name.slice(0, 36).padEnd(36)} `);

    let hit = null;
    let usedQuery = null;
    for (const q of queries) {
      try {
        const c = await geocodeQuery(q);
        if (c) { hit = c; usedQuery = q; break; }
      } catch (err) {
        process.stdout.write(`(err: ${err.message}) `);
      }
      await sleep(REQUEST_INTERVAL_MS);
    }
    if (hit) {
      cache[key] = {
        ...hit,
        geocodedAt: new Date().toISOString(),
        approxFromQuery: usedQuery,
      };
      recovered++;
      console.log(`✓ ${hit.lat.toFixed(4)},${hit.lng.toFixed(4)}  via "${usedQuery}"`);
    } else {
      console.log('✗ still no result');
    }
    await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
  }

  console.log(`\nDone. Recovered ${recovered}/${failed.length} addresses.`);
}

main().catch(e => { console.error(e); process.exit(1); });

#!/usr/bin/env node
/**
 * Geocode every dealer address from the live sheet via Nominatim and
 * persist the results to geocode-cache.json. Re-runs are cheap because
 * already-cached addresses are skipped.
 *
 * Nominatim TOS: max 1 request/second, must send a real User-Agent.
 *
 * Run: npm run geocode
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
const REQUEST_INTERVAL_MS = 1100;

function normaliseAddress(addr) {
  return addr.replace(/\s+/g, ' ').trim().toLowerCase();
}

function addressHash(addr) {
  return createHash('sha1').update(normaliseAddress(addr)).digest('hex').slice(0, 16);
}

function parseCSVRows(csvText) {
  const rows = [];
  let cur = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    if (inQuotes) {
      if (ch === '"' && csvText[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cur.push(field); field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && csvText[i + 1] === '\n') i++;
      cur.push(field); rows.push(cur); cur = []; field = '';
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows;
}

function findHeaderIdx(rows) {
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const cells = rows[i].map(c => c.trim().toLowerCase());
    if (cells.includes('name') && (cells.includes('state') || cells.includes('area'))) return i;
  }
  return -1;
}

async function loadCache() {
  try {
    const text = await readFile(CACHE_PATH, 'utf8');
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function geocode(address) {
  const params = new URLSearchParams({
    q: address,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'my',
  });
  const res = await fetch(`${NOMINATIM_BASE}?${params}`, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`nominatim ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lng: lon };
}

async function main() {
  console.log('Fetching sheet…');
  const csv = await fetch(SHEET_CSV_URL).then(r => {
    if (!r.ok) throw new Error(`sheet ${r.status}`);
    return r.text();
  });

  const rows = parseCSVRows(csv);
  const headerIdx = findHeaderIdx(rows);
  if (headerIdx === -1) throw new Error('header not found');
  const header = rows[headerIdx].map(c => c.trim().toLowerCase());
  const nameCol = header.indexOf('name');
  const addressCol = header.findIndex(h => h === 'shop full address' || h === 'address');
  if (nameCol === -1 || addressCol === -1) throw new Error('name/address column missing');

  const dealers = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const name = (r[nameCol] ?? '').trim();
    const address = (r[addressCol] ?? '').trim();
    if (name && address) dealers.push({ name, address });
  }
  console.log(`Found ${dealers.length} dealers with addresses.`);

  const cache = await loadCache();
  let hits = 0;
  let misses = 0;
  let failures = 0;

  for (let i = 0; i < dealers.length; i++) {
    const { name, address } = dealers[i];
    const key = addressHash(address);
    if (cache[key]) { hits++; continue; }

    process.stdout.write(`[${i + 1}/${dealers.length}] ${name.slice(0, 40).padEnd(40)} … `);
    try {
      const coords = await geocode(address);
      if (coords) {
        cache[key] = { ...coords, geocodedAt: new Date().toISOString() };
        console.log(`✓ ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      } else {
        cache[key] = { lat: null, lng: null, geocodedAt: new Date().toISOString(), failed: true };
        console.log('✗ no result');
        failures++;
      }
      misses++;
      // Persist after each request so a crash doesn't lose progress.
      await saveCache(cache);
    } catch (err) {
      console.log(`✗ error: ${err.message}`);
      failures++;
    }
    await sleep(REQUEST_INTERVAL_MS);
  }

  await saveCache(cache);
  console.log(`\nDone. cache hits: ${hits}, new lookups: ${misses}, failures: ${failures}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

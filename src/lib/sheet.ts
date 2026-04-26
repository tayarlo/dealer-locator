import { createHash } from 'crypto';
import { Dealer } from './types';
import geocodeCacheJson from '../../geocode-cache.json';

interface CachedCoord {
  lat: number | null;
  lng: number | null;
  geocodedAt?: string;
  failed?: boolean;
}

const geocodeCache = geocodeCacheJson as Record<string, CachedCoord>;

function addressHash(addr: string): string {
  const normalised = addr.replace(/\s+/g, ' ').trim().toLowerCase();
  return createHash('sha1').update(normalised).digest('hex').slice(0, 16);
}

function lookupCoords(address: string): { latitude?: number; longitude?: number } {
  if (!address) return {};
  const entry = geocodeCache[addressHash(address)];
  if (!entry || entry.failed || entry.lat == null || entry.lng == null) return {};
  return { latitude: entry.lat, longitude: entry.lng };
}

export const DEALER_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1vw2xxD83jNNkhuGQd-NYQBctMsVSxOF7M7D7hfdTtvg/export?format=csv&gid=1276340913';

interface ColIdx {
  name: number;
  area: number;
  state: number;
  address: number;
  googleLink: number;
  whatsapp: number;
  phone: number;
  productsJson: number;
  productCols: { col: number; label: string }[];
}

function findCols(header: string[]): ColIdx {
  const norm = header.map(h => h.trim().toLowerCase());
  const find = (...candidates: string[]) => {
    for (const c of candidates) {
      const i = norm.indexOf(c.toLowerCase());
      if (i !== -1) return i;
    }
    return -1;
  };

  const productCols: { col: number; label: string }[] = [];
  const productMap: Record<string, string> = {
    'wiper / lth': 'Wiper',
    'wiper': 'Wiper',
    'wiper fluid': 'Wiper Fluid',
    'tpms / set': 'TPMS',
    'tpms': 'TPMS',
    'valve / set': 'Valve',
    'valve': 'Valve',
    'inflator': 'Inflator',
    'tyre repair kit': 'Tyre Repair Kit',
  };
  norm.forEach((h, i) => {
    if (productMap[h]) productCols.push({ col: i, label: productMap[h] });
  });

  return {
    name: find('name'),
    area: find('area'),
    state: find('state'),
    address: find('shop full address', 'address'),
    googleLink: find('google link'),
    whatsapp: find('contact', 'whatsapp'),
    phone: find('wix contact', 'phone'),
    productsJson: find('wix'),
    productCols,
  };
}

function parseCSVRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    if (inQuotes) {
      if (ch === '"' && csvText[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cur.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && csvText[i + 1] === '\n') i++;
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  return rows;
}

function findHeaderRow(rows: string[][]): number {
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const cells = rows[i].map(c => c.trim().toLowerCase());
    if (cells.includes('name') && (cells.includes('state') || cells.includes('area'))) {
      return i;
    }
  }
  return -1;
}

function extractProducts(row: string[], cols: ColIdx): string[] {
  // Prefer the JSON-style "WIX" column (e.g. ["Wiper","Valve"])
  if (cols.productsJson >= 0) {
    const raw = (row[cols.productsJson] ?? '').trim();
    if (raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map(String).map(s => s.trim()).filter(Boolean);
        }
      } catch {
        // fall through to quantity-column fallback
      }
    }
  }
  // Fallback: any positive value in a product quantity column means dealer carries it.
  return cols.productCols
    .filter(({ col }) => (row[col] ?? '').trim().length > 0)
    .map(({ label }) => label);
}

export function parseDealerSheet(csvText: string): Dealer[] {
  const rows = parseCSVRows(csvText);
  const headerIdx = findHeaderRow(rows);
  if (headerIdx === -1) return [];

  const cols = findCols(rows[headerIdx]);
  if (cols.name === -1) return [];

  const dealers: Dealer[] = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const name = (r[cols.name] ?? '').trim();
    if (!name) continue;

    const whatsappRaw = cols.whatsapp >= 0 ? (r[cols.whatsapp] ?? '').trim() : '';
    const whatsapp = whatsappRaw.replace(/[^0-9]/g, '');
    const phone = cols.phone >= 0 ? (r[cols.phone] ?? '').trim() : '';
    const products = Array.from(new Set(extractProducts(r, cols)));
    const address = cols.address >= 0 ? (r[cols.address] ?? '').trim() : '';

    dealers.push({
      id: String(dealers.length + 1),
      name,
      address,
      phone: phone || (whatsapp ? `+${whatsapp}` : ''),
      whatsapp,
      state: cols.state >= 0 ? (r[cols.state] ?? '').trim() : '',
      area: cols.area >= 0 ? (r[cols.area] ?? '').trim() : '',
      products,
      ...lookupCoords(address),
    });
  }
  return dealers;
}

export async function fetchDealersFromSheet(): Promise<Dealer[]> {
  const res = await fetch(DEALER_SHEET_CSV_URL, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Sheet fetch failed: ${res.status}`);
  }
  const csv = await res.text();
  return parseDealerSheet(csv);
}

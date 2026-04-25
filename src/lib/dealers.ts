import { Dealer } from './types';

const SAMPLE_DEALERS: Dealer[] = [
  {
    id: '1',
    name: '17 WD Motorsport Rim & Tyres',
    address: 'A33, Jalan Tuanku 4 Taman Salak Selatan 57000 Kuala Lumpur, 57000 WP, Wilayah Persekutuan Kuala Lumpur',
    phone: '6010-8808 139',
    whatsapp: '60108808139',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Kuala Lumpur',
    products: ['TPMS'],
    latitude: 3.0738,
    longitude: 101.7013,
  },
  {
    id: '2',
    name: '4M Carcare Auto Service Sdn Bhd',
    address: 'NO : 45, Jalan Gangsa SD 5/3H, Bandar Sri Damansara, 52200 Kuala Lumpur',
    phone: '6011-1933 513',
    whatsapp: '601119339513',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Kuala Lumpur',
    products: ['Valve', 'TPMS', 'Inflator'],
    latitude: 3.0556,
    longitude: 101.6364,
  },
  {
    id: '3',
    name: 'Advance Autocare Services Sdn Bhd',
    address: '19, Jalan 8/23a, Off, Jalan Genting Kelang, Medan Makmur, 53300 Kuala Lumpur',
    phone: '6012-6256 665',
    whatsapp: '60126256665',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Kuala Lumpur',
    products: ['Wiper', 'Valve', 'Inflator'],
    latitude: 3.0650,
    longitude: 101.7250,
  },
  {
    id: '4',
    name: 'Ah Man Tyre Auto Service Sdn Bhd',
    address: 'No. 153, 155, Jalan 8/1, Seksyen 8, 43650 Bandar Baru Bangi, Selangor',
    phone: '6012-3119 175',
    whatsapp: '60123119175',
    state: 'Selangor',
    area: 'Bangi',
    products: ['Wiper'],
    latitude: 2.9505,
    longitude: 101.7869,
  },
  {
    id: '5',
    name: 'Ah Man Tyre Service Centre Sdn Bhd',
    address: 'No, 39-G, Jalan BK5A/2, Bandar Kinrara, Puchong 47180 Malaysia',
    phone: '6010-2257 657',
    whatsapp: '60102257657',
    state: 'Selangor',
    area: 'Puchong',
    products: ['Valve', 'Fluid'],
    latitude: 3.0021,
    longitude: 101.6187,
  },
  {
    id: '6',
    name: 'Ann Huat Auto Care Enterprise',
    address: 'pusat perdagangan hill park, 32, Jln Hillpark 11/5, Bandar Hillpark, 42300 Puncak Alam, Selangor',
    phone: '6012-2420 302',
    whatsapp: '60122420302',
    state: 'Selangor',
    area: 'Puncak Alam',
    products: ['Fluid', 'TPMS', 'Valve'],
    latitude: 3.2369,
    longitude: 101.4258,
  },
  {
    id: '7',
    name: 'Aso Tyre Service Centre (M) Sdn Bhd',
    address: '344, Jln Kampung Bandar Dalam, Kampung Bandar Dalam, Kuala Lumpur 51000 Malaysia',
    phone: '6016-6209 209',
    whatsapp: '60166209209',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Kuala Lumpur',
    products: ['Wiper'],
    latitude: 3.0777,
    longitude: 101.6916,
  },
  {
    id: '8',
    name: 'Astar Tire & Service Centre',
    address: 'No.33 Jalan BP 7/2, Bandar Bukit Puchong, 47100 Puchong Selangor',
    phone: '6012-8776 638',
    whatsapp: '60128776638',
    state: 'Selangor',
    area: 'Puchong',
    products: ['Wiper', 'Valve', 'TPMS', 'Inflator'],
    latitude: 3.0153,
    longitude: 101.6155,
  },
  {
    id: '9',
    name: 'BL Auto Car Care & Tyres (M) Sdn Bhd',
    address: '2393, Jalan E 1/5, Taman Ehsan Industrial Area, 52100 Kuala Lumpur',
    phone: '6012-3227 870',
    whatsapp: '60123227870',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Kuala Lumpur',
    products: ['Valve', 'TPMS', 'Inflator'],
    latitude: 3.0722,
    longitude: 101.6355,
  },
  {
    id: '10',
    name: 'BS Tyre Auto Services PLT',
    address: '3, Jalan Sinar Sentul 1, Sentul, 51000 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    phone: '6012-6227 901',
    whatsapp: '60126227901',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Kuala Lumpur',
    products: ['TPMS', 'Valve'],
    latitude: 3.0650,
    longitude: 101.6850,
  },
  {
    id: '11',
    name: 'Best GT Auto Sdn Bhd',
    address: 'No. SH-13, Jalan Cengal Selatan, Taman Setapak, 53000 Kuala Lumpur',
    phone: '6019-3515 959',
    whatsapp: '60193515959',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Setapak',
    products: ['Valve', 'Inflator'],
    latitude: 3.2150,
    longitude: 101.7200,
  },
  {
    id: '12',
    name: 'Bro Tyre Auto Service Centre',
    address: 'No.22, Jln 3/4C, Desa Melawati, 53100 Kuala Lumpur',
    phone: '6010-6466 664',
    whatsapp: '60106466664',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Melawati',
    products: ['Valve'],
    latitude: 3.1600,
    longitude: 101.7100,
  },
  {
    id: '13',
    name: 'CN Auto Tyre Sdn Bhd (HQ)',
    address: 'No 41, 43, 45 & 47, Jalan Tukul N15/N, Seksyen 15, 40200 Shah Alam, Selangor',
    phone: '6011-3903 187',
    whatsapp: '601139030187',
    state: 'Selangor',
    area: 'Shah Alam',
    products: ['Inflator', 'TPMS', 'Valve', 'Wiper', 'Fluid', 'Tyre Repair Kit'],
    latitude: 3.0738,
    longitude: 101.5185,
  },
  {
    id: '14',
    name: 'Fastfit Motorsports Sdn Bhd (Cheras)',
    address: '17, Persiaran Mewah, Bandar Tun Razak, 56000 Kuala Lumpur',
    phone: '6017-7577 708',
    whatsapp: '60177577708',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    area: 'Cheras',
    products: ['Inflator', 'TPMS', 'Valve', 'Wiper', 'Fluid', 'Tyre Repair Kit'],
    latitude: 3.1074,
    longitude: 101.7165,
  },
  {
    id: '15',
    name: 'Fastfit Motorsports Sdn Bhd (Semenyih)',
    address: 'No 1-5 Jalan Seri Mawar 1, Taman Seri Mawar, Semenyih, Selangor 43500',
    phone: '6017-7135 599',
    whatsapp: '60177135599',
    state: 'Selangor',
    area: 'Semenyih',
    products: ['TPMS', 'Valve'],
    latitude: 2.9500,
    longitude: 101.8500,
  },
  {
    id: '16',
    name: 'Dk Tyre Auto',
    address: 'No.14, Jalan SS 20/10, Taman Damansara Kim, 47400 Petaling Jaya, Selangor',
    phone: '6012-2272 936',
    whatsapp: '60122272936',
    state: 'Selangor',
    area: 'Petaling Jaya',
    products: ['Valve', 'Inflator', 'Tyre Repair Kit'],
    latitude: 3.1275,
    longitude: 101.6287,
  },
  {
    id: '17',
    name: 'ECW Motorsports Sdn Bhd - Bangi',
    address: '9, Jalan P10/21, Taman Perindustrian Selaman, 43650 Bandar Baru Bangi, Selangor',
    phone: '6011-3978 779',
    whatsapp: '601139785779',
    state: 'Selangor',
    area: 'Bangi',
    products: ['TPMS', 'Valve'],
    latitude: 2.9550,
    longitude: 101.7800,
  },
  {
    id: '18',
    name: 'Hexagold Sdn Bhd',
    address: 'No.31, Jalan Puteri 5/3, Bandar Puteri Puchong, Puchong 47100 Malaysia',
    phone: '6012-6623 835',
    whatsapp: '60126623835',
    state: 'Selangor',
    area: 'Puchong',
    products: ['Wiper', 'Valve', 'TPMS', 'Inflator'],
    latitude: 3.0150,
    longitude: 101.6050,
  },
  {
    id: '19',
    name: 'Hon Tyres & Auto Services',
    address: '1, Jalan SJ 1, Taman Setia Jaya, 48000 Rawang, Selangor',
    phone: '6019-3936 222',
    whatsapp: '60193936222',
    state: 'Selangor',
    area: 'Rawang',
    products: ['Wiper', 'Valve'],
    latitude: 3.3100,
    longitude: 101.5800,
  },
  {
    id: '20',
    name: 'Chong Sheng Tyre & Auto Service Centre',
    address: 'No. 38 A-G, Jalan Pandan Cahaya 2/2, Ampang 68000 Malaysia',
    phone: '6016-2631 160',
    whatsapp: '60162631160',
    state: 'Selangor',
    area: 'Ampang',
    products: ['Wiper', 'Valve'],
    latitude: 3.1300,
    longitude: 101.7600,
  },
];

export async function fetchDealersFromGoogleSheets(sheetUrl: string): Promise<Dealer[]> {
  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) {
    throw new Error('Invalid Google Sheets URL');
  }

  const spreadsheetId = match[1];
  const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch data from Google Sheets');
  }

  const csvText = await response.text();
  return parseDealersFromCSV(csvText);
}

export function parseDealersFromCSV(csvText: string): Dealer[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  const dealers: Dealer[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= 8) {
      dealers.push({
        id: String(i),
        name: values[0] || '',
        address: values[1] || '',
        phone: values[2] || '',
        whatsapp: values[3] || '',
        state: values[4] || '',
        area: values[5] || '',
        products: values[6] ? values[6].split(',').map(p => p.trim()) : [],
        latitude: values[7] ? parseFloat(values[7]) : undefined,
        longitude: values[8] ? parseFloat(values[8]) : undefined,
      });
    }
  }

  return dealers;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function filterDealers(dealers: Dealer[], filters: { state: string; area: string; products: string[] }): Dealer[] {
  return dealers.filter(dealer => {
    if (filters.state && dealer.state !== filters.state) return false;
    if (filters.area && dealer.area !== filters.area) return false;
    if (filters.products.length > 0) {
      const hasAllProducts = filters.products.every(product =>
        dealer.products.some(p => p.toLowerCase().includes(product.toLowerCase()))
      );
      if (!hasAllProducts) return false;
    }
    return true;
  });
}

export function getUniqueAreas(dealers: Dealer[]): string[] {
  const areas = new Set(dealers.map(d => d.area).filter(Boolean));
  return Array.from(areas).sort();
}

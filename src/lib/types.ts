export interface Dealer {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  state: string;
  area: string;
  products: string[];
  latitude?: number;
  longitude?: number;
}

export interface FilterState {
  state: string;
  area: string;
  products: string[];
}

export const PRODUCTS = [
  'Inflator',
  'TPMS',
  'Tyre Repair Kit',
  'Valve',
  'Windshield Fluid',
  'Wiper'
] as const;

export const STATES = [
  'Wilayah Persekutuan Kuala Lumpur',
  'Selangor',
  'Johor',
  'Pulau Pinang',
  'Perak',
  'Kedah',
  'Kelantan',
  'Terengganu',
  'Pahang',
  'Negeri Sembilan',
  'Melaka',
  'Sabah',
  'Sarawak'
] as const;

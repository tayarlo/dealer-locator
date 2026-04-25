import { NextResponse } from 'next/server';
import { fetchDealersFromSheet } from '@/lib/sheet';

export const revalidate = 300;

export async function GET() {
  try {
    const dealers = await fetchDealersFromSheet();
    return NextResponse.json({ dealers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, dealers: [] }, { status: 502 });
  }
}

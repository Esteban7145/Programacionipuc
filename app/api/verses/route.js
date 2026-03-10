import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Verse } from '@/models/Verse';

const sampleRVR1960 = [
  { reference: 'Juan 3:16', text: 'Porque de tal manera amó Dios al mundo...' },
  { reference: 'Salmos 23:1', text: 'Jehová es mi pastor; nada me faltará.' },
  { reference: 'Romanos 8:28', text: 'Y sabemos que a los que aman a Dios...' }
];

export async function GET() {
  await connectDB();
  const verses = await Verse.find().limit(50);
  if (verses.length > 0) return NextResponse.json(verses);
  return NextResponse.json(sampleRVR1960);
}

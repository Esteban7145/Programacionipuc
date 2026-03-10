import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Song } from '@/models/Song';

const schema = z.object({ tenantId: z.string(), title: z.string().min(1), stanzas: z.array(z.string()).min(1) });

const toSlides = (stanzas) => stanzas.flatMap((s) => s.split(/\n{2,}/).map((line) => line.trim())).filter(Boolean);

export async function POST(req) {
  await connectDB();
  const data = schema.parse(await req.json());

  const created = await Song.create({ ...data, slides: toSlides(data.stanzas) });
  return NextResponse.json(created, { status: 201 });
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  const songs = await Song.find(tenantId ? { tenantId } : {}).sort({ createdAt: -1 }).limit(100);
  return NextResponse.json(songs);
}

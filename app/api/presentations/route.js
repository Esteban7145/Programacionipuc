import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Presentation } from '@/models/Presentation';

const schema = z.object({
  tenantId: z.string(),
  name: z.string(),
  type: z.enum(['SONG', 'VERSE', 'SPECIAL', 'MIXED']).default('MIXED'),
  slides: z.array(z.string()).min(1)
});

export async function POST(req) {
  await connectDB();
  const data = schema.parse(await req.json());
  const created = await Presentation.create(data);
  return NextResponse.json(created, { status: 201 });
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(3),
  price: z.number().nonnegative(),
  stock: z.number().nonnegative(),
  category: z.string().min(1),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  active: z.boolean().default(true)
});

export async function GET() {
  await connectDB();
  const products = await Product.find({ active: true }).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  const product = await Product.create(parsed.data);
  return NextResponse.json(product, { status: 201 });
}

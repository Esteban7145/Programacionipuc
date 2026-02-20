import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const order = await Order.create(body);
  return NextResponse.json({
    order,
    payment: {
      stripeReady: true,
      mercadoPagoReady: true,
      message: 'Checkout preparado para integrar pasarelas reales.'
    }
  });
}

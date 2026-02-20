import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

export async function GET() {
  await connectDB();
  const [orders, lowStock, topProducts] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(5),
    Product.find({ stock: { $lt: 5 } }),
    Product.find().sort({ sold: -1 }).limit(5)
  ]);

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const chart = orders.map((order) => ({
    date: new Date(order.createdAt).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
    total: order.total || 0
  }));

  return NextResponse.json({ totalSales, topProducts, lowStock, recentOrders: orders, chart });
}

'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="mb-4 text-lg">Ventas</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C49A51" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#5BA8FF" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Area dataKey="total" stroke="#C49A51" fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

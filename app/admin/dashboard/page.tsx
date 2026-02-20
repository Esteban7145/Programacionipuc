'use client';

import { useEffect, useState } from 'react';
import CloudinaryDropzone from '@/components/cloudinary-dropzone';
import SalesChart from '@/components/sales-chart';
import { Product } from '@/types';

const emptyForm = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  sizes: '',
  colors: '',
  images: [] as string[],
  featured: false,
  active: true
};

export default function AdminDashboardPage() {
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<any>(null);

  const load = async () => {
    const [pRes, dRes] = await Promise.all([fetch('/api/products'), fetch('/api/dashboard')]);
    setProducts(await pRes.json());
    setStats(await dRes.json());
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, sizes: form.sizes.split(',').map((x) => x.trim()).filter(Boolean), colors: form.colors.split(',').map((x) => x.trim()).filter(Boolean) })
    });
    setForm(emptyForm);
    load();
  };

  const update = async (id: string, data: Partial<Product>) => {
    await fetch(`/api/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-8">
      {stats && (
        <section className="grid gap-4 md:grid-cols-4">
          <div className="glass rounded-2xl p-4"><p className="text-sm text-white/60">Ventas Totales</p><p className="text-2xl text-az-gold">${stats.totalSales?.toLocaleString('es-CO')}</p></div>
          <div className="glass rounded-2xl p-4"><p className="text-sm text-white/60">Top vendidos</p><p className="text-2xl">{stats.topProducts?.length}</p></div>
          <div className="glass rounded-2xl p-4"><p className="text-sm text-white/60">Bajo stock</p><p className="text-2xl">{stats.lowStock?.length}</p></div>
          <div className="glass rounded-2xl p-4"><p className="text-sm text-white/60">Pedidos recientes</p><p className="text-2xl">{stats.recentOrders?.length}</p></div>
        </section>
      )}

      {stats && <SalesChart data={stats.chart} />}

      <section className="glass rounded-3xl p-6">
        <h2 className="mb-4 text-xl">Crear producto</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl bg-white/10 p-3" />
          <input type="number" placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-xl bg-white/10 p-3" />
          <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl bg-white/10 p-3 md:col-span-2" />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="rounded-xl bg-white/10 p-3" />
          <input placeholder="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl bg-white/10 p-3" />
          <input placeholder="Tallas (S,M,L)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="rounded-xl bg-white/10 p-3" />
          <input placeholder="Colores (Negro,Dorado)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="rounded-xl bg-white/10 p-3" />
          <CloudinaryDropzone onUploaded={(urls) => setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }))} />
          <button onClick={save} className="rounded-xl bg-az-gold p-3 font-medium text-black">Guardar producto</button>
        </div>
      </section>

      <section className="space-y-3">
        {products.map((p) => (
          <div key={p._id} className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
            <div className="flex-1">
              <p>{p.name}</p>
              <p className="text-sm text-white/60">Stock: {p.stock} · ${p.price.toLocaleString('es-CO')}</p>
            </div>
            <button onClick={() => update(p._id, { active: !p.active })} className="rounded-lg border border-white/20 px-3 py-2">{p.active ? 'Desactivar' : 'Activar'}</button>
            <button onClick={() => update(p._id, { stock: p.stock + 1 })} className="rounded-lg border border-white/20 px-3 py-2">+ Inventario</button>
            <button onClick={() => remove(p._id)} className="rounded-lg border border-red-400/40 px-3 py-2 text-red-300">Eliminar</button>
          </div>
        ))}
      </section>
    </div>
  );
}

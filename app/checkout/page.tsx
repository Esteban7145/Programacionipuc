'use client';

import { useCart } from '@/context/cart-context';

export default function CheckoutPage() {
  const { items, total, removeItem } = useCart();

  const pay = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        total
      })
    });
    alert('Pedido creado. Checkout preparado para Stripe/MercadoPago.');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id + item.selectedColor + item.selectedSize} className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
              <p>{item.name}</p>
              <p className="text-sm text-white/60">{item.selectedColor} {item.selectedSize}</p>
            </div>
            <div className="flex items-center gap-4">
              <p>${(item.price * item.quantity).toLocaleString('es-CO')}</p>
              <button onClick={() => removeItem(item._id)} className="text-red-300">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <aside className="glass h-fit rounded-2xl p-6">
        <h2 className="text-xl">Resumen</h2>
        <p className="mt-4 text-3xl text-az-gold">${total.toLocaleString('es-CO')}</p>
        <button onClick={pay} className="mt-6 w-full rounded-xl bg-az-gold py-3 font-medium text-black">Proceder al pago</button>
      </aside>
    </div>
  );
}

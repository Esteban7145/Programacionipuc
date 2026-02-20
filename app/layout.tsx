import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'AZ Moda | Boutique tecnológica de lujo',
  description: 'Tienda futurista y elegante de AZ Moda'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 pb-16">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IPUC Proyección',
  description: 'Plataforma profesional de proyección para iglesias IPUC'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

import './globals.css';

export const metadata = {
  title: 'IPUC Proyección',
  description: 'Plataforma profesional de proyección para iglesias IPUC'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

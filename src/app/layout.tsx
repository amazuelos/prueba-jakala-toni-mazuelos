import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Dulces Pétalos — Floristería online',
    template: '%s | Dulces Pétalos',
  },
  description: 'Compra las mejores flores y plantas online. Envíos a toda España.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-gray-100">
        <header className="shrink-0 bg-white shadow-sm" style={{ height: 66 }}>
          <div className="mx-auto flex h-full max-w-7xl items-center px-4">
            <Link href="/" className="text-xl font-bold text-green-700">
              🌸 Dulces Pétalos
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

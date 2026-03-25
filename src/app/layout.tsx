import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import logo from './assets/icons/logo.svg';
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
        <header className="flex h-16.5 shrink-0 items-center justify-center bg-white">
            <Link href="/" className="h-10">
              <Image src={logo} alt="Dulces Pétalos" className="h-10 w-auto" priority />
            </Link>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

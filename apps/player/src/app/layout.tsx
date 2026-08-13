import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TV Menu Player | Burger AI Studio 🍔📺',
  description: 'Digital Signage player client for Burger Shop TV screens',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Burger AI Studio 🍔🤖',
  description: 'AI-Powered Campaign & Asset Generator for Burger Shops',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

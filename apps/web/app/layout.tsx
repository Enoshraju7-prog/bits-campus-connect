import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BITS Campus Connect',
  description: 'Social networking platform for BITS Pilani students across all campuses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

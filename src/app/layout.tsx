import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tayarlo — Official Michelin Accessories Dealer Locator',
  description:
    'Find an Official Michelin Licensee near you. Every dealer in the Tayarlo network carries genuine Michelin Lifestyle accessories — TPMS valve caps, tyre inflators, wiper blades, wiper fluid, and tyre repair kits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

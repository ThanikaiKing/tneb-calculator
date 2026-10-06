import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'PulseWatt • Electricity Consumption & Blink Interval Calculator',
  description:
    'Calculate real-time electricity wattage (Watts/kW), daily units, and Tamil Nadu TANGEDCO EB bill directly from your energy meter blink interval and imp/kWh rating.',
  keywords: [
    'electricity meter blink calculator',
    'imp/kwh calculator',
    'real time wattage from meter blink',
    'tangedco electricity bill calculator',
    'units per day calculator',
    'tamil nadu eb tariff calculator',
  ],
  authors: [{ name: 'PulseWatt' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-[#07090e] text-slate-100 antialiased flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}

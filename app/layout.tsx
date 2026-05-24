// app/layout.tsx
import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'AI Spend Audit — Find where you overpay for AI tools',
  description:
    'Free tool that audits your AI tool stack and finds where your team is overspending. Enter your tools, get instant savings breakdown. No login required.',
  openGraph: {
    title: 'AI Spend Audit — Find where you overpay for AI tools',
    description:
      'Free 2-minute audit. Enter your AI tools, see exactly where you are overspending and how much you could save.',
    url: 'https://ai-spend-audit-gamma-pearl.vercel.app',
    siteName: 'AI Spend Audit',
    type: 'website',
    images: [
      {
        url: 'https://ai-spend-audit-gamma-pearl.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Spend Audit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit — Find where you overpay for AI tools',
    description: 'Free 2-minute audit. No login required.',
    images: ['https://ai-spend-audit-gamma-pearl.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
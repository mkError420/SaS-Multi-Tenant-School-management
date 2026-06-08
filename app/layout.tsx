import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getPlatformSettings } from '../lib/school';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPlatformSettings();
  return {
    title: `${settings.platformName} - Multi-Tenant School Management`,
    description: 'Responsive SaaS school management system built with Next.js, Node.js, MongoDB, and Tailwind CSS.',
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getPlatformSettings();
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen flex-col">
          <Header platformName={settings.platformName} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

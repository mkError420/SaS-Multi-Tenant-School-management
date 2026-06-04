import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css'; 

export const metadata: Metadata = {
  title: 'SchoolSpace - Multi-Tenant School Management',
  description: 'Responsive SaaS school management system built with Next.js, Node.js, MongoDB, and Tailwind CSS.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

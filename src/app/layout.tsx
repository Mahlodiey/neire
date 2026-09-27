import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEIRE - Adaptive AI Learning Platform',
  description: 'Your personal AI tutor that adapts to your learning style',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}

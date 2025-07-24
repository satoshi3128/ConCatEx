import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FloatingElementsProvider } from '@/components/FloatingElementsProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Concat - 大野聡',
  description: 'Webアプリケーション開発を専門とするフリーランスエンジニア・大野聡のサイト',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-snap-container min-h-screen flex flex-col`}
      >
        <FloatingElementsProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </FloatingElementsProvider>
      </body>
    </html>
  );
}

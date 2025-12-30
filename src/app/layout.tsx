import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vizu - Otimize sua Imagem Social',
    template: '%s | Vizu',
  },
  description:
    'Descubra como sua foto é percebida. Receba feedback honesto sobre Atração, Confiança e Inteligência.',
  keywords: ['foto', 'perfil', 'feedback', 'avaliação', 'linkedin', 'tinder', 'imagem profissional'],
  authors: [{ name: 'Vizu' }],
  creator: 'Vizu',
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Vizu',
    title: 'Vizu - Otimize sua Imagem Social',
    description: 'Descubra como sua foto é percebida. Receba feedback honesto.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vizu - Otimize sua Imagem Social',
    description: 'Descubra como sua foto é percebida. Receba feedback honesto.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

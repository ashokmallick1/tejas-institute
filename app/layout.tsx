import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth/auth-context';
import { LmsProvider } from '@/lib/store/lms-store';

export const metadata: Metadata = {
  title: 'TEJAS | Institute of Advanced Technology (Bhubaneswar, Odisha)',
  description: 'Building India’s Next-Generation Technologists. Learn While You Work across AI Engineering, Cloud, VLSI, Embedded Systems, Robotics, and GPU Infrastructure.',
  keywords: [
    'TEJAS Institute',
    'Bhubaneswar Technology Institute',
    'AI Engineering India',
    'Learn While You Work',
    'Generative AI Fellowship',
    'VLSI Verification',
    'Platform Engineering Kubernetes',
    'DeepTech Academy Odisha'
  ],
  authors: [{ name: 'TEJAS Institute of Advanced Technology' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'TEJAS Institute of Advanced Technology | Learn While You Work',
    description: 'Premier engineering academy building India’s next-generation technologists. Explore 18 cutting-edge programs in AI, Cloud, Semiconductor & Robotics.',
    url: '/',
    siteName: 'TEJAS Institute of Advanced Technology',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEJAS | Institute of Advanced Technology',
    description: 'Building India’s Next-Generation Technologists. Learn While You Work in Bhubaneswar, Odisha.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TEJAS',
  },
  icons: {
    icon: '/tejas-logo-192.png',
    apple: '/tejas-logo-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Plus Jakarta Sans — Scaler's body/UI font. Clean, modern, authoritative. */}
        {/* Source Serif 4 — Scaler's editorial headline serif. Institutional authority. */}
        {/* JetBrains Mono — code blocks, tags, eyebrows */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            --font-serif: 'Source Serif 4', Georgia, serif;
            --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <LmsProvider>
              {children}
            </LmsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

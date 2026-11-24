import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { IntroProvider } from '@/components/intro-provider';
import { SectionNavigationProvider } from '@/components/section-navigation-provider';
import { Navbar } from '@/components/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Valoria Tech',
  description:
    'Where Vision Becomes Technology. Autonomous engineering, bespoke architectures, and next-generation systems.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logos/valoria-tab-icon.png', type: 'image/png' },
      { url: '/logos/Valoria%20Icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
        <IntroProvider>
          <SectionNavigationProvider>
            <Navbar />
            {children}
          </SectionNavigationProvider>
        </IntroProvider>
      </body>
    </html>
  );
}

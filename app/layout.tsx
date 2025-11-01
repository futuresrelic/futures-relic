import type { Metadata } from 'next';
import './globals.css';
import { VintageFilmOverlay } from '@/components/VintageOverlay';

export const metadata: Metadata = {
  title: "Future's Relic - A Blockchain Storytelling Experience",
  description: 'Navigate the mysteries of Future\'s Relic through an immersive 1920s-inspired interface. Connect your WAX wallet, discover relics, and unlock the chronicle.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <VintageFilmOverlay />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

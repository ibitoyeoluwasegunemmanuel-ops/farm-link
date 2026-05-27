import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FarmLink — Africa\'s Agricultural Operating System',
  description: 'Connect farmers, buyers, transporters and investors. Buy fresh produce directly from farms with escrow protection.',
  keywords: 'agriculture, farmers, Nigeria, buy produce, farm products, agri-tech',
  openGraph: {
    title: 'FarmLink — Africa\'s Agricultural Operating System',
    description: 'Buy fresh produce directly from farms with escrow-protected payments.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

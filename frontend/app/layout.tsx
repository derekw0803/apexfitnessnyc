import type { Metadata } from 'next';
import { Bebas_Neue, Barlow_Condensed, Inter } from 'next/font/google';
import './globals.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexfitness.fit';
const SITE_TITLE = 'ApexFitnessNYC | Personal Training for Men 40+ in NYC';
const SITE_DESCRIPTION =
  'Precision personal training, hormone-optimized nutrition, and a 90-day transformation system for men 40+, in-person in New York City or online coaching nationwide.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'ApexFitnessNYC',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ApexFitnessNYC',
  url: SITE_URL,
  description:
    'Personal training and online coaching for men 40+. In-person training in New York City; online coaching available nationwide.',
  areaServed: [
    { '@type': 'City', name: 'New York, NY' },
    { '@type': 'Country', name: 'United States' },
  ],
  sameAs: ['https://www.instagram.com/apex.fitnessnyc'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${barlowCondensed.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="noise" />
        <div id="cursor" suppressHydrationWarning />
        <div id="cursor-ring" suppressHydrationWarning />

        <Nav />

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <main style={{ flex: 1, paddingTop: '72px' }}>{children}</main>
          <Footer />
        </div>

        {/* ── Floating chat button ── */}
        {/* <button className="chat-btn" aria-label="Open chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button> */}

        {/* ── Custom cursor script ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var cursor = document.getElementById('cursor');
            var ring = document.getElementById('cursor-ring');
            var mx = 0, my = 0, rx = 0, ry = 0;
            document.addEventListener('mousemove', function(e) {
              mx = e.clientX; my = e.clientY;
              cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
            });
            function animRing() {
              rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
              ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
              requestAnimationFrame(animRing);
            }
            animRing();
          })();
        ` }} />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://cha-do-matteo-gamma.vercel.app'),
  title: 'Chá do Matteo | Uma pequena grande aventura',
  description: 'Venha celebrar a chegada do Matteo. Um encontro cheio de carinho em 21 de novembro de 2026, em Pouso Alegre.',
  openGraph: {
    title: 'Chá do Matteo | Uma pequena grande aventura',
    description: 'Venha celebrar a chegada do Matteo. Um encontro cheio de carinho em 21 de novembro de 2026, em Pouso Alegre.',
    url: 'https://cha-do-matteo-gamma.vercel.app/',
    siteName: 'Chá do Matteo',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Convite para o Chá do Matteo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chá do Matteo | Uma pequena grande aventura',
    description: 'Venha celebrar a chegada do Matteo. Um encontro cheio de carinho em Pouso Alegre.',
    images: ['/opengraph-image'],
  },
  robots: { index: false, follow: false },
};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="pt-BR"><body>{children}</body></html>;}

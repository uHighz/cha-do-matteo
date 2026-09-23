import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Chá do Matteo | Uma pequena grande aventura',description:'Venha celebrar a chegada do Matteo. Confirme sua presença e escolha seu presente.',robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="pt-BR"><body>{children}</body></html>;}

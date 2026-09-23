import { Suspense } from 'react';
import { PaymentReturn } from '@/components/payment-return';
export default function Page(){return <Suspense fallback={<main>Verificando pagamento…</main>}><PaymentReturn /></Suspense>;}

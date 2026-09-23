"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function PaymentReturn() {
  const params = useSearchParams();
  const [message, setMessage] = useState("Estamos conferindo seu pagamento com segurança…");
  const [paid, setPaid] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(true);
  const order = params.get("order_nsu");
  const transaction = params.get("transaction_nsu");
  const slug = params.get("slug");
  useEffect(() => {
    let active = true;
    async function verify() {
      setBusy(true);
      try {
        const saved = sessionStorage.getItem("matteo-reservation");
        if (!saved) throw new Error("Abra este link no mesmo navegador em que escolheu os presentes. Não encontramos sua reserva nesta sessão.");
        const { reservation } = JSON.parse(saved);
        const response = await fetch("/api/payments/check", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${reservation.token}` }, body: JSON.stringify({ order_nsu: order, transaction_nsu: transaction, slug }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Não foi possível consultar o pagamento agora.");
        if (active) { setPaid(result.status === "paid"); setMessage(result.status === "paid" ? "Pagamento confirmado! Seus presentes estão garantidos. Obrigado por fazer parte da história do Matteo." : result.status === "needs_review" ? "O pagamento precisa ser conferido pela família. Não faça um novo pagamento enquanto aguarda essa conferência." : "Seu pagamento ainda está em processamento. Você pode conferir novamente em alguns instantes."); }
      } catch (error) { if (active) setMessage((error as Error).message); }
      finally { if (active) setBusy(false); }
    }
    verify();
    return () => { active = false; };
  }, [order, transaction, slug, attempt]);
  return <main className="section payment-page"><a className="brand" href="/">m<span>✧</span></a><p className="eyebrow">Um carinho para o Matteo</p><h1>{paid ? "Recebido com amor." : "Conferindo seu carinho."}</h1><p role="status">{message}</p>{!paid && <button className="button" disabled={busy} onClick={() => setAttempt(value => value + 1)}>{busy ? "Conferindo…" : "Conferir pagamento novamente"}</button>}<a className="text-link" href="/#presentes">Voltar para o convite ↗</a></main>;
}

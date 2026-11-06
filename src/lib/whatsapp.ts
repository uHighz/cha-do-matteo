// Links "clique para conversar" do WhatsApp (wa.me). Nada é enviado pelo site:
// o link apenas abre a conversa no WhatsApp de quem clicou, com o texto preenchido.

export const defaultNotice = `Oi, {nome}! Tudo bem? 💙

Passando para avisar que o *Chá do Matteo* mudou de horário: será no dia *21/11 (sábado) às 12h*, e não mais às 14h. O local continua o mesmo, no salão de festas do Condomínio Gran Royale.

Todos os detalhes estão no convite: https://cha-do-matteo-gamma.vercel.app

Contamos com você! 🦒🐘`;

/** Converte o número salvo no RSVP para o formato internacional exigido pelo wa.me. */
export function whatsappNumber(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  // DDD + número (10 ou 11 dígitos): número brasileiro sem código do país.
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  // Já informado com código do país (Brasil ou exterior).
  if (digits.length >= 12 && digits.length <= 15) return digits;
  return null;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name.trim();
}

export function fillNotice(template: string, name: string): string {
  return template.replaceAll('{nome}', firstName(name));
}

export function whatsappLink(raw: string, text: string): string | null {
  const number = whatsappNumber(raw);
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null;
}

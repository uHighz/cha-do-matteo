# Verificação — 23/09/2026

## Aprovado

- Cinco testes de validação e build Next.js.
- Convite inspecionado visualmente em desktop e celular (390 × 844); nenhum erro registrado no navegador.
- RSVP no navegador → banco → reserva da fralda → mimo obrigatório → confirmação física → persistência após recarregar.
- Login administrativo local e em produção; cookie HttpOnly e Secure em produção; acesso anônimo ao painel negado.
- Três reservas concorrentes para duas toalhas: duas aceitas e uma recusada, sem exceder estoque.
- Repetir confirmação de presentes físicos não duplica a reserva; token incorreto recusado.
- Recado oculto antes da moderação e visível depois da aprovação administrativa.
- Catálogo público com 15 produtos e 140 unidades após remoção dos registros de teste.
- Pagamentos reais bloqueados por PAYMENTS_ENABLED=false.
- Domínio público acessível sem login Vercel; painel continua exigindo autenticação.

## Ainda pendente

- Recuperação por e-mail, upload de foto e moderação de foto de ponta a ponta.
- Testes SQL de expiração, pagamento tardio e idempotência do pagamento: arquivo preparado, mas a ferramenta SQL disponível recusou escrita. O teste de concorrência acima foi executado por APIs reais, separadamente.
- Homologação InfinitePay e repasse de taxas ao comprador.
- QR Pix livre depende dos dados do recebedor.
- GitHub remoto depende da autorização da CLI.

Os testes de integração estão em tests/integration.mjs e removem os registros que criam. Não executar em ambiente com convidados reais sem revisar as pré-condições. A suíte completa não foi declarada aprovada: os itens pendentes acima permanecem abertos.

## Atualização — 24/09/2026

- Checkout InfinitePay habilitado em produção após confirmação da família: Pix e cartão com repasse das taxas ao convidado.
- Código atualizado para responder webhook no formato documentado e continuar consultando transações iniciadas mesmo quando novos checkouts forem desabilitados.
- Deploy de produção pronto. Nenhuma compra de teste foi feita; retorno, liquidação e conciliação da primeira transação real seguem sem validação.

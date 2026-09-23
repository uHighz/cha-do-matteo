# Banco e API

Migração local: `migrations/20260922104710_baby_shower.sql`. Criada com `supabase migration new`; ainda precisa ser aplicada e verificada no projeto correto.

Todas as tabelas têm RLS habilitado e acesso anônimo/autenticado revogado. Somente rotas do servidor usam a service-role. Não envie essa chave ao navegador. As RPCs usam security invoker, search_path vazio e execute concedido somente à service_role.

As reservas usam um lock transacional compartilhado para selecionar estoque, concluir presentes, iniciar checkout e registrar pagamento. Pendente vence em 15 minutos sem exigir cron. Valores são copiados do catálogo pelo banco, nunca do navegador. Pagamento tardio vira needs_review e não ocupa estoque.

Execute `tests/reservations.sql` em banco isolado após a migração. O teste usa transação com rollback: verifica falta de mimo, esgotamento, liberação por expiração, preço no servidor, valor incorreto, idempotência, pagamento tardio e revogação de acesso anônimo. Falta validar duas sessões concorrentes e integração real InfinitePay antes de ativar pagamentos.

Configuração do servidor: SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY, ADMIN_USER_ID ou ADMIN_USER_IDS. Para checkout: NEXT_PUBLIC_SITE_URL=https://..., INFINITEPAY_HANDLE=gabriel-aquino02 e PAYMENTS_ENABLED=true apenas após homologação. Nunca criar usuário com senha padrão. O painel deve usar usuário Supabase real listado por UUID ou com app_metadata.role=admin.

O checkout fica bloqueado em `__creating__` se a solicitação ao provedor tiver resultado incerto. Conferir o pedido pelo order_nsu junto ao provedor antes de desbloquear; não limpar automaticamente ou criar cobrança nova. Webhook e retorno do navegador são sempre conferidos por payment_check antes de settle_payment. Nenhum teste de pagamento real foi executado automaticamente.

Fotos ficam no bucket privado guest-photos; somente registros approved recebem URLs assinadas de 15 minutos. Limites de 5 MB, assinaturas binárias JPG/PNG/WebP e moderação. Recados também entram pendentes. Há limites de tentativas persistidos no banco; configure também limites no provedor para tráfego abusivo. A tabela rate_limits pode ser limpa periodicamente para linhas antigas.

Rotas: POST/PATCH /api/rsvp; GET /api/catalog; POST /api/reservations; GET/PATCH /api/reservations/:id; POST /api/reservations/:id/complete; POST /api/checkout; POST /api/payments/check; POST /api/webhooks/infinitepay; GET/POST /api/messages e /api/photos. Tokens de convidado/reserva são aleatórios e apenas seu hash é armazenado.

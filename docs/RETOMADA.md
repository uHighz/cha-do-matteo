# Ponto de retomada — 23/09/2026

Convite publicado: https://cha-do-matteo-gamma.vercel.app. Painel: /admin. Conta uhighz provisionada com senha aleatória em arquivo local ignorado .tools/admin-initial.json. Login em produção validado. Consulte VERIFICACAO.md para resultados e limites dos testes.

## Implementado localmente

- Convite safari azul, data confirmada em 21/11/2026 às 14h (Brasília), mapa, presença e acompanhantes.
- Seleção de fralda e mimo, modalidades independentes, reserva de 15 minutos e controle transacional de estoque preparado em SQL.
- Checkout InfinitePay ativo em produção; confirmação consultada no servidor e no webhook. Primeira transação real ainda não testada.
- Mural e fotos moderados, painel com login, recuperação de senha, CSV, preços, quantidades, cancelamento e registro de entrega.
- Migração baby_shower aplicada no projeto Matteo. Testes SQL preparados; execução bloqueada porque execute_sql usa transação somente leitura.
- Dependências instaladas com versões fixadas e lockfile.

## Verificação

Cinco testes de validação, build, revisão visual desktop/celular e integração RSVP/reservas/concorrência/moderação passaram. Acesso em produção validado. Checkout online habilitado em 24/09/2026; primeira transação real e testes SQL de expiração, pagamento tardio e idempotência ainda pendentes. Consulte VERIFICACAO.md.

Repositório Git local inicializado com branch main; envio ao GitHub depende da autenticação.

## Acessos pendentes

1. Acesso direto Supabase Matteo confirmado: xjfsmntlkemjlycfnoor, ativo e saudável. Migração aplicada; catálogo carregado.
2. Usar o projeto já criado pelo proprietário; não criar outro. A listagem incompleta da integração não impede acesso direto.
3. Concluir autenticação GitHub CLI pelo fluxo oficial; códigos de dispositivo expiram e não devem ser armazenados aqui. Criar repositório privado e enviar apenas arquivos versionáveis.
4. Variáveis de Development e Production verificadas, inclusive administrador e Checkout InfinitePay habilitado em Production. Nunca copiar arquivos .env locais, credenciais ou .tools para o repositório.
5. Executar testes SQL por conexão autorizada com escrita. Administrador já provisionado. Advisors de segurança retornaram somente informações RLS sem policies, esperado no desenho em que todas as consultas passam pelo servidor e anon/authenticated não possuem grants.
6. Concluir recuperação de senha e fluxo de fotos. Fazer a primeira transação real de baixo valor e validar retorno, webhook, conciliação e situação de pagamento tardio.

## Detalhes ainda pendentes

- Data e hora confirmadas: 21/11/2026 às 14h (Brasília).
- Nome do recebedor para compor o QR Pix de contribuição livre; chave já está no catálogo.
- Configuração da InfinitePay confirmada: Pix e cartão com repasse das taxas ao convidado; Checkout Integrado habilitado pela família.
- Validar o fluxo com uma transação real e revisar expiração, pagamentos tardios e conciliação antes de considerar a homologação financeira concluída.

As interrupções dos agentes por limite de uso podem deixar alterações parciais. Sempre conferir arquivos e executar os testes antes de publicar.

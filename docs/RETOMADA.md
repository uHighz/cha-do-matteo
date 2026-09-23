# Ponto de retomada — 23/09/2026

Convite publicado: https://cha-do-matteo-gamma.vercel.app. Painel: /admin. Conta uhighz provisionada com senha aleatória em arquivo local ignorado .tools/admin-initial.json. Login em produção validado. Consulte VERIFICACAO.md para resultados e limites dos testes.

## Implementado localmente

- Convite safari azul, data provisória centralizada, mapa, presença e acompanhantes.
- Seleção de fralda e mimo, modalidades independentes, reserva de 15 minutos e controle transacional de estoque preparado em SQL.
- Checkout InfinitePay com verificação no servidor; desativado até homologação.
- Mural e fotos moderados, painel com login, recuperação de senha, CSV, preços, quantidades, cancelamento e registro de entrega.
- Migração baby_shower aplicada no projeto Matteo. Testes SQL preparados; execução bloqueada porque execute_sql usa transação somente leitura.
- Dependências instaladas com versões fixadas e lockfile.

## Verificação

Cinco testes de validação, build, revisão visual desktop/celular e integração RSVP/reservas/concorrência/moderação passaram. Acesso em produção validado. Testes SQL de expiração e pagamentos reais ainda pendentes. Consulte VERIFICACAO.md.

Repositório Git local inicializado com branch main; envio ao GitHub depende da autenticação.

## Acessos pendentes

1. Acesso direto Supabase Matteo confirmado: xjfsmntlkemjlycfnoor, ativo e saudável. Migração aplicada; catálogo carregado.
2. Usar o projeto já criado pelo proprietário; não criar outro. A listagem incompleta da integração não impede acesso direto.
3. Concluir autenticação GitHub CLI pelo fluxo oficial; códigos de dispositivo expiram e não devem ser armazenados aqui. Criar repositório privado e enviar apenas arquivos versionáveis.
4. Variáveis de Development e Production verificadas, inclusive administrador e pagamentos desativados. Nunca copiar arquivos .env locais, credenciais ou .tools para o repositório.
5. Executar testes SQL por conexão autorizada com escrita. Administrador já provisionado. Advisors de segurança retornaram somente informações RLS sem policies, esperado no desenho em que todas as consultas passam pelo servidor e anon/authenticated não possuem grants.
6. Concluir configuração e teste de recuperação de senha no Supabase, fotos e homologação financeira. A primeira versão já está publicada para revisão.

## Detalhes ainda pendentes

- Data e hora reais do evento.
- Nome do recebedor para compor o QR Pix de contribuição livre; chave já está no catálogo.
- Confirmar configuração de taxas por conta do comprador e habilitação do Checkout Integrado na InfinitePay. Não presumir que o código configura essas opções na conta.
- Homologar pagamento, expiração e conciliação de pagamento tardio antes de ativar PAYMENTS_ENABLED.

As interrupções dos agentes por limite de uso podem deixar alterações parciais. Sempre conferir arquivos e executar os testes antes de publicar.

# Chá do Matteo

Site de convite para o chá de bebê do Matteo, com tema safári, catálogo de fraldas e mimos, confirmação de presença, Pix livre opcional e área administrativa.

## Estado

Versão inicial publicada: https://cha-do-matteo-gamma.vercel.app. Supabase conectado, administrador provisionado e testes de acesso em produção aprovados em 23/09/2026. Data confirmada: 21/11/2026 às 14h (Brasília). Checkout InfinitePay ativo desde 24/09/2026; primeira transação real ainda não testada. Repositório remoto GitHub e recuperação por e-mail ainda pendentes; detalhes em docs/RETOMADA.md.

## Desenvolvimento local

O projeto usa Next.js e TypeScript. Após instalar as dependências e configurar as variáveis exigidas pela aplicação:

```sh
npm run dev
```

Scripts disponíveis no `package.json`:

```sh
npm run typecheck
npm test
npm run build
```

Esses comandos descrevem como executar as verificações; sua presença não significa que passaram. Consulte o registro de QA entregue com o projeto para os resultados efetivos. Sem um banco configurado, não presumir persistência real nem funcionamento completo da administração.

## Documentação

- [Planejamento, texto de presentes e catálogo](docs/PLANEJAMENTO.md)
- [Acessos e estado dos serviços](docs/ACESSOS.md)
- [Publicação, operação e encerramento](docs/OPERACAO.md)

Os dados do evento e do catálogo estão em `src/lib/catalog.ts`. Senhas e chaves secretas não devem ser adicionadas aos arquivos versionados. O nome de usuário previsto é `uhighz`; os detalhes de provisionamento estão na documentação de acessos.

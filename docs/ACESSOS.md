# Acessos e serviços

## Estado registrado

Verificado em 23/09/2026: convite publicado em https://cha-do-matteo-gamma.vercel.app e painel em https://cha-do-matteo-gamma.vercel.app/admin. Supabase conectado e conta administrativa provisionada. Repositório GitHub ainda depende da autenticação da CLI.

| Recurso | Identificação prevista | Estado |
| --- | --- | --- |
| Administrador do convite | `uhighz` | Provisionado; login local e em produção testados |
| E-mail administrativo | `contactgaquino@gmail.com` | Conta criada; recuperação por e-mail ainda não homologada |
| GitHub | Conta `uHighz`; repositório privado previsto `cha-do-matteo` | CLI aguarda autenticação; repositório não criado |
| Supabase | [Matteo](https://supabase.com/dashboard/project/xjfsmntlkemjlycfnoor) | Acesso confirmado; migração baby_shower aplicada em 22/09/2026 |
| Vercel | [cha-do-matteo](https://vercel.com/uhighz/cha-do-matteo) | Publicado; domínio principal público, endereços de testes protegidos |

Identificador Vercel: `prj_vAQo0nsUf5tWJMR8FwAZZ0WPJvVq`. A sessão local da CLI foi autenticada pelo proprietário. O projeto Supabase CodeTech existente não foi alterado.

Identificador Supabase: `xjfsmntlkemjlycfnoor`; organização `sooquuhjfailpxhjtxpb`; região `us-east-1`. A listagem da integração não mostrava Matteo, mas a consulta direta e a inspeção do banco funcionaram. Não criar outro projeto.

A integração Supabase–Vercel configurou as variáveis no ambiente Production. A URL foi conferida e aponta para Matteo. As chaves secretas não são exportáveis pelo comando `vercel env pull`: o arquivo `.env.production.local` contém marcadores `[SENSITIVE]`, que não são credenciais utilizáveis. Não copiar esses marcadores para o ambiente local.

Development verificado em 22/09/2026: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e SUPABASE_SERVICE_ROLE_KEY importadas em `.env.development.local` sem exibição de valores. Consulta autenticada catalog_availability bem-sucedida: 15 produtos e 140 unidades disponíveis. Credenciais locais ignoradas pelo Git.

Senha inicial aleatória guardada somente no arquivo local ignorado `.tools/admin-initial.json`. Não usar a senha simples citada no planejamento. Nenhuma senha deve ser registrada na documentação, no código ou em commits.

## Provisionar o administrador

Administrador já criado; não criar uma segunda conta. A autorização usa ADMIN_USER_ID, configurado localmente e na Vercel. O script local de provisionamento reutiliza a conta pelo e-mail e não redefine a senha de conta existente.

Para concluir recuperação de senha, conferir em Supabase → Authentication → URL Configuration: Site URL `https://cha-do-matteo-gamma.vercel.app` e Redirect URL `https://cha-do-matteo-gamma.vercel.app/admin/redefinir`. Validar envio e recebimento de recuperação antes de anunciar essa função como pronta.

Verificar separadamente: login administrativo autorizado, recusa de conta comum e recusa de visitante sem sessão. Não habilitar acesso administrativo com base em um nome enviado pelo navegador ou em metadados editáveis pelo próprio usuário.

## Credenciais de integração

Guardar valores reais apenas em variáveis locais ignoradas pelo Git e nas configurações dos ambientes de hospedagem. Usar os nomes definidos no arquivo de exemplo de ambiente entregue com o código, sem inventar nomes adicionais.

Chaves publicáveis podem ser usadas pelo cliente, em conjunto com as políticas adequadas de acesso. Chaves secretas ou `service_role` pertencem exclusivamente ao servidor e contornam as políticas de acesso por linha; não podem aparecer no navegador, documentação, logs ou repositório. Referência: [chaves de API do Supabase](https://supabase.com/docs/guides/getting-started/api-keys).

## Depois da configuração

Atualizar este documento com links dos recursos criados e data da verificação, sem copiar tokens ou senhas. Registrar quem mantém os serviços e como recuperar o acesso. A autenticação nas plataformas externas deve ser concluída pelo proprietário quando necessária.

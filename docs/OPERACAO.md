# Operação e publicação

## Estado

Este roteiro descreve atividades pendentes. Não comprova criação de serviços, implantação, aplicação de banco ou testes em produção.

## Preparar a publicação

1. Conferir informações do evento, catálogo, texto de presentes e dados Pix com o responsável. Não publicar valores demonstrativos como se fossem reais.
2. Executar as verificações disponíveis no projeto e registrar resultados, falhas e limitações reais.
3. Criar ou selecionar o repositório GitHub e revisar os arquivos antes de enviá-los. Credenciais, arquivos de ambiente reais e dados de convidados não devem fazer parte do histórico.
4. Criar ou selecionar o projeto Supabase. Aplicar os arquivos de banco entregues com a aplicação e verificar suas políticas de acesso e funções. Uma migração presente no repositório ainda não está aplicada no serviço.
5. Provisionar a conta administrativa conforme [Acessos](ACESSOS.md).
6. Importar o repositório na Vercel e configurar as variáveis exigidas pela aplicação no ambiente correto. A [integração oficial com GitHub](https://vercel.com/docs/git/vercel-for-github) descreve importação e implantações vinculadas ao repositório.
7. Publicar uma versão de prévia e verificar os fluxos completos com dados fictícios.
8. Publicar a versão destinada aos convidados e registrar URL, versão e data. Verificar novamente no endereço final.

## Conferência antes de compartilhar

- Convite legível no celular; nome, data, horário e localização corretos.
- Catálogo com preços e quantidades aprovados; kits identificados como três pares quando aplicável.
- Confirmações e escolhas realmente persistidas no banco, inclusive após atualizar a página.
- Estoque respeitado quando dois convidados tentarem escolher a última unidade.
- Pix livre opcional e dados do favorecido conferidos. Copiar uma chave ou gerar QR Code não comprova pagamento.
- Respostas dos convidados inacessíveis a visitantes e contas não autorizadas.
- Login, encerramento da sessão e proteção das operações administrativas verificados.
- Mensagens claras quando houver falha de rede ou serviço indisponível.

## Durante o evento

Consultar confirmações e presentes na área administrativa. Se houver conciliação manual de Pix, conferir no banco antes de marcar uma contribuição como recebida. Corrigir dados por uma operação administrativa autorizada; não editar diretamente pedidos reais sem entender o impacto no estoque.

Se o site apresentar erro, registrar horário, página e ação realizada sem expor dados pessoais. Consultar os registros do serviço correspondente. Não compartilhar credenciais ao pedir suporte.

## Encerramento

Depois do evento, combinar com o responsável o período necessário para manter os registros. Encerrar confirmações e contribuições quando apropriado. Exportar apenas o necessário e apagar os dados conforme a decisão acordada. Remoções definitivas precisam ter seu alcance conferido antes de execução.

## Registro de validação

Manter resultados concretos das verificações: data, versão, ambiente e resultado. Separar testes locais de testes em serviços reais. Enquanto não houver registro de execução, as verificações acima permanecem pendentes.

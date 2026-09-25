# Planejamento — Chá do Matteo

## Escopo e estado

Construção autorizada de um convite para o chá de bebê do Matteo, com catálogo de presentes, confirmação de presença, opção de Pix livre e administração. A implementação local está em andamento. A existência de código não comprova integração ou publicação em serviços reais.

Fonte dos dados do convite e catálogo: `src/lib/catalog.ts`.

## Evento

- Nome: Matteo.
- Data confirmada: 21 de novembro de 2026, às 14h, horário de Brasília (America/Sao_Paulo). O campo `dateConfirmed` está verdadeiro.
- Endereço cadastrado: Alameda das Acácias, 100 — Pouso Alegre, MG, 37550-000. Salão de festas ao lado da portaria do condomínio.
- Coordenadas cadastradas: latitude -22.306887, longitude -45.914635.
- Direção visual: tema safári, com leitura e interação adequadas ao celular.

## Texto integral dos presentes

A chegada do Matteo está enchendo nossos corações de alegria e também nossa casinha de novos sonhos.

Estamos preparando cada detalhe com muito amor para recebê-lo: as primeiras roupinhas, as fraldinhas, os produtos de higiene, os brinquedos e tudo o que fará parte dos seus primeiros momentos de vida.

Além do chá do Matteo, também estamos montando nosso novo lar, onde viveremos tantos momentos especiais em família. Cada presente representa um gesto de carinho que nos acompanhará nessa nova etapa da vida. Seja um item para o Matteo, um presente para o nosso lar ou uma contribuição em valor livre, tudo será recebido com muito amor e fará parte da nossa história.

O mais importante é celebrar esse momento ao lado de pessoas tão especiais como você.

## Catálogo aprovado

Preços por item ou pacote, em reais. Quantidade é a meta de unidades do catálogo; o número de fraldas se refere ao conteúdo aproximado de cada pacote comercial. Marcas de referência: Pampers, Huggies ou Babysec.

| Fralda | Conteúdo aproximado do pacote | Quantidade de pacotes | Preço por pacote |
| --- | ---: | ---: | ---: |
| P | 72 fraldas | 5 | R$ 100,00 |
| M | 68 fraldas | 18 | R$ 85,00 |
| G | 60 fraldas | 22 | R$ 90,00 |
| XG | 56 fraldas | 18 | R$ 80,00 |
| XXG | 52 fraldas | 7 | R$ 80,00 |

| Mimo | Descrição | Quantidade | Preço por item |
| --- | --- | ---: | ---: |
| Lenços umedecidos | Pacote de aproximadamente 96 lenços | 25 | R$ 28,00 |
| Creme preventivo de assaduras | Bisnaga de 30 g | 5 | R$ 27,00 |
| Sabonete líquido infantil | Frasco de 200 ml | 8 | R$ 33,00 |
| Shampoo infantil | Frasco de 200 ml | 7 | R$ 20,00 |
| Toalha com capuz | Algodão, aproximadamente 90 × 70 cm | 2 | R$ 60,00 |
| Fraldinha de boca | Unidade avulsa | 4 | R$ 15,00 |
| Fralda de pano | Unidade, aproximadamente 70 × 70 cm | 4 | R$ 20,00 |
| Babador | Unidade | 4 | R$ 30,00 |
| Manta | Malha, aproximadamente 90 × 80 cm | 5 | R$ 65,00 |
| Kit de meias | Kit com 3 pares | 6 | R$ 30,00 |

Marcas de referência dos lenços: Huggies, Pampers, Johnson’s, Bepantol Baby ou Personalidade Baby. O kit de meias contém três pares; seis kits correspondem a dezoito pares.

## Pix

Contribuição de valor livre é opcional. A chave configurada está em `src/lib/catalog.ts`; verificar o favorecido no aplicativo bancário antes de compartilhar o site. Seleção de presente, cópia de chave e declaração do convidado não comprovam recebimento. A confirmação de pagamento depende de conferência real, sem presumir integração bancária automática.

## Responsabilidades dos agentes

| Agente | Responsabilidades | Critério de conclusão |
| --- | --- | --- |
| Frontend | Convite, catálogo, formulários, acessibilidade e adaptação ao celular | Fluxos navegáveis, estados de erro e sucesso claros e dados aprovados exibidos corretamente |
| Backend | Persistência, validação, disponibilidade dos presentes e operações administrativas | Dados persistidos, concorrência tratada e autorização verificada no servidor |
| QA | Testes funcionais, casos inválidos, falhas e verificação visual | Resultados executados registrados e falhas prioritárias corrigidas e conferidas |
| Segurança | Credenciais, privacidade, acesso e abuso de formulários | Achados documentados, correções prioritárias revisadas e limitações explicitadas |

## Pendências para publicação

- Confirmar a data definitiva e conferir endereço e localização.
- Concluir e verificar integrações reais, banco e provisionamento administrativo.
- Registrar resultados de testes e revisão de segurança.
- Registrar URLs dos serviços e do site publicado.
- Definir o período de conservação dos dados dos convidados e o encerramento das confirmações.

O roteiro de publicação está em [Operação](OPERACAO.md), e o estado das contas está em [Acessos](ACESSOS.md).

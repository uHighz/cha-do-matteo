# Verificação do convite

## Executado em 22/09/2026

- `npm test`: 5 testes passaram. Cobrem contrato de reserva, modalidades de entrega, limites, UUIDs e remoção de preços/estoque/status fornecidos pelo cliente.
- `npm run typecheck`: passou após a extração das validações puras.
- `npm run build`: compilação e TypeScript passaram, mas prerenderização de `/pagamento` falhou com `Element type is invalid ... got: undefined`. Encaminhado ao frontend; repetir build após correção.
- Os testes unitários não comprovam estoque, transações, pagamento ou persistência.

## Teste de banco preparado, ainda não executado

`supabase/tests/reservations.sql`, criado pelo backend, usa transação com rollback e deve rodar em banco isolado após a migração. Cobre esgotamento, liberação por expiração, exigência de mimo, preço do servidor, valor incorreto, idempotência de pagamento, pagamento tardio e permissões anônimas. Não comprova concorrência entre conexões.

## Aceitação E2E pendente

Usar somente convidados fictícios e ambiente de teste. Registrar URL, navegador, data, esperado/observado e evidência de cada execução.

| Fluxo | Resultado necessário |
| --- | --- |
| Convite a 360 px e desktop, teclado | Sem corte horizontal; foco visível; campos rotulados; dados provisórios identificados |
| RSVP com acompanhantes e alteração | Uma identidade preservada; resposta atualizada no banco; negativa não cria reserva |
| Reserva e atualização da página | ID/token e seleção recuperados; tempo restante correto; status consultado no servidor |
| Duas famílias disputam última unidade simultaneamente | Exatamente uma reserva aceita; outra recebe conflito; estoque nunca negativo |
| Troca para presente esgotado | Operação falha inteira; seleção anterior e estoque permanecem consistentes |
| Expiração e tentativa de concluir | Servidor rejeita conclusão; unidade volta a ficar disponível |
| Levar fralda e mimo | Confirmação persiste; reenvio não consome outra unidade |
| Pagamento desabilitado ou indisponível | Mensagem clara; nenhum falso sucesso; opção de levar permanece compreensível |
| Checkout e retorno | Verificar valor no servidor, confirmação real pelo provedor e estado pendente; parâmetros da URL não comprovam pagamento |
| Webhook duplicado e pagamento após expiração | Não duplicar baixa; pagamento tardio exige revisão e não toma unidade de outra família |
| Token ausente, errado ou de outra reserva | Não consultar nem alterar dados de outra família |
| Memórias antes/depois da moderação | Recados e fotos privados antes da aprovação, públicos somente após aprovação |
| Foto inválida ou maior que 5 MB | Rejeição sem publicação ou sucesso enganoso |
| Administração | Usuário não autorizado bloqueado; autorizado modera e confere lista sem expor dados ao público |
| Falha de rede e clique repetido | Erro recuperável; nenhum sucesso falso; conferir duplicação no banco |

## Achados estáticos encaminhados

- Reenvio de RSVP criava nova identidade. Frontend informou correção para PATCH e preservação do token; conferir E2E.
- Atualização da página perdia reserva ativa. Frontend informou persistência da sessão e recuperação via GET; conferir E2E.
- Identidade sem situação de presença permitia tentar presentear após negativa. Frontend informou bloqueio; conferir E2E.

Nenhum servidor de desenvolvimento foi iniciado pelo QA; verificação de navegador e integrações aguarda provisionamento do ambiente.

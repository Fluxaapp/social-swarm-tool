# Fluxa Support — integração de clientes

O sistema do cliente não precisa usar o Supabase do Fluxa nem receber credenciais administrativas. Cada projeto recebe uma **Project Key pública e limitada**, armazenada no frontend apenas para conversar com a API de Reports daquele projeto.

## Instalação

1. No Fluxa, acesse **Reports → Projetos & integrações**.
2. Cadastre/selecione o projeto.
3. Informe os domínios autorizados e gere uma Project Key.
4. Copie a chave no momento da criação — o Fluxa armazena somente o hash e não mostra a chave completa novamente.
5. Adicione o script abaixo ao layout global do sistema do cliente:

```html
<script
  src="https://SEU-DOMINIO-FLUXA/fluxa-support.js"
  data-fluxa-key="fluxa_pub_SUA_CHAVE"
  data-fluxa-label="Solicitar ajuste"
></script>
```

Opcionalmente, posicione o botão à esquerda:

```html
<script
  src="https://SEU-DOMINIO-FLUXA/fluxa-support.js"
  data-fluxa-key="fluxa_pub_SUA_CHAVE"
  data-fluxa-position="left"
></script>
```

## O que o widget já faz

- cria uma solicitação no projeto correto;
- coleta URL, rota, navegador e resolução automaticamente;
- permite ao usuário acompanhar os pedidos criados naquele navegador;
- mostra mensagens enviadas pela Glass Maind;
- permite responder dentro do próprio sistema;
- exibe orçamentos enviados pelo Fluxa;
- permite aprovar ou recusar orçamento;
- a aprovação fica registrada no Fluxa e o orçamento aprovado fica imutável;
- não expõe notas internas;
- não lista solicitações de outros usuários/dispositivos do projeto.

## Segurança

- a chave de integração não é `service_role` e não dá acesso administrativo ao banco;
- a chave completa não é persistida no banco, apenas seu SHA-256;
- cada chamada é isolada pelo projeto associado à chave;
- domínios autorizados podem ser configurados por integração;
- a API aplica limites básicos contra spam;
- a listagem completa de reports de um projeto não é exposta ao widget;
- IDs de reports são UUIDs opacos e o widget guarda localmente somente os IDs criados naquele navegador.

## Endpoint central

O widget usa a Edge Function `fluxa-reports-api`. A API deve continuar centralizada no Supabase do Fluxa; não conectar esse módulo ao Supabase de cada cliente.

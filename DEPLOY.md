# Deploy no Cloudflare Workers

> Este guia explica como hospedar o **frontend** do portal no Cloudflare Workers.  
> O **backend (banco de dados, autenticação, storage e funções)** continua sendo executado pelo **Lovable Cloud** (Supabase), portanto não é necessário migrar dados ou reconfigurar auth/storage.

## O que já foi configurado no projeto

- `wrangler.toml` — configuração do Cloudflare Workers (nome, domínios, variáveis públicas, assets).
- Scripts no `package.json`:
  - `deploy:cloudflare` — builda e faz deploy para produção.
  - `deploy:cloudflare:preview` — builda em modo desenvolvimento e faz deploy para preview.
- `wrangler` instalado como dependência de desenvolvimento.

## Variáveis de ambiente

As variáveis **públicas** (publishable) já estão no `wrangler.toml`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

A variável **secreta** `SUPABASE_SERVICE_ROLE_KEY` **não pode** ser salva no repositório. Ela deve ser configurada no Cloudflare via CLI:

```bash
bun wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` bypassa o RLS — só é usada pelas server functions para operações administrativas (criar usuários, gerenciar roles, etc.).

## Passo a passo para hospedar

### 1. Pré-requisitos locais

- Ter o repositório clonado localmente.
- Ter o [Bun](https://bun.sh/) instalado.
- Instalar as dependências:

```bash
bun install
```

### 2. Autenticar no Cloudflare

```bash
bun wrangler login
```

Isso abrirá o navegador para autorizar o Wrangler na sua conta Cloudflare.

### 3. Configurar o secret do Supabase

```bash
bun wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Cole o valor da chave quando solicitado.  
> **Atenção:** não compartilhe nem salve essa chave em arquivos de texto.

### 4. Fazer o deploy

```bash
bun run deploy:cloudflare
```

O comando irá:

1. Buildar o projeto para produção (`dist/client` + `dist/server`).
2. Publicar o Worker no Cloudflare com o nome `cmcoutomagalhaesminas`.
3. Associar os domínios:
   - `www.cmcoutomagalhaesminas.com.br`
   - `cmcoutomagalhaesminas.com.br`

### 5. Configurar o DNS no Cloudflare

Se o domínio já estiver usando os nameservers da Cloudflare, o Workers Connect automaticamente resolve o tráfego para o Worker.

No dashboard da Cloudflare:

1. Vá em **Workers & Pages** → **cmcoutomagalhaesminas**.
2. Clique em **Triggers** → **Routes**.
3. Verifique se as rotas estão ativas:
   - `www.cmcoutomagalhaesminas.com.br/*`
   - `cmcoutomagalhaesminas.com.br/*`
4. Se necessário, adicione um registro `CNAME` ou use a opção **Custom Domain** no próprio painel do Worker.

### 6. Testar

Acesse:

- `https://www.cmcoutomagalhaesminas.com.br`
- `https://cmcoutomagalhaesminas.com.br`

Verifique se as páginas públicas carregam e se o login no painel administrador funciona.

## Atualizações futuras

Sempre que fizer alterações no código e quiser publicar:

```bash
bun run deploy:cloudflare
```

Para deploy de teste/ambiente de preview:

```bash
bun run deploy:cloudflare:preview
```

## Alternativa mais simples (recomendada para manutenção)

Se você quiser menos complexidade, pode **publicar pelo próprio Lovable** e apenas apontar o domínio registrado para a Cloudflare como DNS/proxy, seguindo as instruções de domínios customizados do Lovable. Nesse cenário, o Lovable continua hospedando o frontend e o backend, e você só gerencia o DNS no Cloudflare.

## Solução de problemas

- **Worker não encontra variáveis:** confirme que `bun wrangler secret put SUPABASE_SERVICE_ROLE_KEY` foi executado.
- **Build falha:** rode `bun run build` isoladamente e verifique os erros.
- **Rotas não funcionam:** no dashboard do Cloudflare, verifique se as rotas do Worker estão ativas e se o domínio está configurado como *Custom Domain*.
- **Erro de CORS no login:** as configurações de OAuth do Supabase (Lovable Cloud) devem ter o novo domínio adicionado nas URLs de redirecionamento autorizadas.

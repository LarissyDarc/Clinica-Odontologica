# Sorriso — Clínica Odontológica

Landing page acadêmica em React, com identidade visual própria, layout responsivo e publicação automatizada no GitHub Pages.

## Executar

Requisito: Node.js 22 e npm.

```sh
npm install
npm run dev
```

Para gerar e conferir a versão de produção:

```sh
npm run build
npm run preview
```

## Recursos

- Apresentação da clínica, quatro tratamentos e etapas do atendimento.
- Menu móvel, perguntas expansíveis e formulário funcional com histórico local e integração opcional com Supabase.
- Navegação por teclado, link para pular ao conteúdo, estados de foco e respeito à preferência por movimento reduzido.
- Fotografias ilustrativas armazenadas em `public/images`, sem downloads de imagens durante a navegação. Fontes Google com alternativa local sans-serif.
- Clínica fictícia: sem profissionais, credenciais ou depoimentos inventados. O formulário armazena solicitações no navegador e as envia ao Supabase quando configurado. Registrar uma solicitação não confirma uma consulta.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie os arquivos deste projeto para a branch `main`, incluindo `package-lock.json`.
3. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
4. Na aba **Actions**, acompanhe o workflow **Publicar no GitHub Pages**. Se necessário, use **Run workflow** após configurar o Pages.
5. Ao terminar, o endereço publicado aparece em **Settings → Pages** e no ambiente `github-pages`.

Se preferir enviar pelo terminal (substitua USUARIO e REPOSITORIO):

```sh
git init -b main
git add .
git commit -m "Cria landing page da Clínica Sorriso"
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

O Vite usa `base: './'` para que os assets funcionem também em `https://USUARIO.github.io/REPOSITORIO/`.

## Roteiro de apresentação (3–5 minutos)

1. **Objetivo:** apresentar uma clínica odontológica e facilitar o interesse em uma avaliação.
2. **Identidade:** turquesa, fotografia ampla e composição limpa para comunicar acolhimento. A marca Sorriso é fictícia.
3. **Demonstração:** navegar pelas seções, mostrar o menu em tela estreita, abrir as perguntas e testar o formulário com um e-mail fictício.
4. **Tecnologia:** React organiza a interface; `useState` controla menu, perguntas e confirmação; CSS Grid e media queries adaptam o layout; Vite gera a versão final.
5. **Publicação:** mostrar a URL do GitHub Pages e explicar que o GitHub Actions compila e publica após alterações na branch `main`.
6. **Limite e evolução:** mostrar o histórico persistente e os estados local/enviado. A integração online depende de configurar o projeto Supabase; agendamentos não são confirmados automaticamente.

## Arquivos principais

- `src/main.jsx`: componentes, conteúdo e interações.
- `src/styles.css`: identidade visual e responsividade.
- `.github/workflows/deploy.yml`: publicação automática.

## Referências visuais e fotografias

Direção visual inspirada em https://lucianayano.com.br/ (turquesa, banner amplo, tratamentos e apresentação da clínica). Conteúdo e marca próprios para o projeto acadêmico.

Fotos ilustrativas do Unsplash, armazenadas localmente:
- Consultório: https://images.unsplash.com/photo-1629909613654-28e377c37b09
- Avaliação odontológica: https://images.unsplash.com/photo-1606811971618-4486d14f3f99

As imagens não representam instalações ou profissionais reais da Clínica Sorriso.

## Armazenamento no navegador e no banco online

O formulário salva nome, e-mail, tratamento, autorização, identificador e data em `localStorage` (`sorriso.requests.v1`). Abra **Administração** no rodapé, ou `/#/admin`, para consultar as solicitações. A página principal mostra apenas o formulário e a confirmação. Ele persiste após recarregar, mas é restrito à mesma origem, porta e perfil do navegador. Pessoas que compartilham esse perfil podem acessar os dados; limpar os dados do site remove as cópias locais.

A integração preparada usa Supabase/PostgreSQL. Sem configuração, somente o salvamento local funciona; a interface informa isso. Não há envio de e-mail automático.

### Conectar Supabase

1. Crie ou abra seu projeto no Supabase e execute `supabase/schema.sql` no SQL Editor.
2. Confira que a Data API está habilitada para o schema `public`.
3. Nas configurações do projeto, copie a URL HTTPS e a chave **publishable** (`sb_publishable_...`).
4. Copie `.env.example` para `.env.local` e preencha:

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SUA_CHAVE_PUBLICA
```

5. Reinicie `npm run dev`. Envie uma solicitação de teste e confira em **Table Editor → appointment_requests**.
6. Para GitHub Pages, adicione as mesmas duas variáveis em **Settings → Secrets and variables → Actions → Variables**, e execute novamente o workflow de publicação.

Use apenas a chave publishable no frontend. As variáveis VITE ficam visíveis no navegador; nunca coloque senha do banco, chave secret ou service_role nelas. A tabela usa RLS e não permite leitura, edição ou exclusão pública. A função `submit_appointment` permite apenas inserir registros validados. O painel Supabase é o local de consulta administrativa.

Se o envio falhar, a cópia local continua pendente. **Enviar ao banco** repete o envio com o mesmo UUID; a função evita duplicatas desse identificador, inclusive quando uma resposta de sucesso se perde na rede. Pedidos antigos não são enviados automaticamente ao conectar o banco. **Remover cópia local** não exclui o registro remoto. Se o navegador bloquear o armazenamento, o formulário tenta o banco e explica qual destino confirmou o salvamento.

O endpoint de cadastro é público e não inclui controle de volume ou CAPTCHA. Para exposição pública com tráfego real, implemente limitação de requisições no backend. Não publique um painel aberto que liste os contatos.

### Verificação

```sh
npm test
npm run build
```

Os testes automatizados verificam persistência, falha de armazenamento, autorização, falha de rede e reenvio com ID estável. A confirmação de gravação no banco real depende de configurar seu projeto.

Documentação: [chaves públicas](https://supabase.com/docs/guides/getting-started/api-keys), [funções de banco](https://supabase.com/docs/guides/database/functions) e [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
## Compatibilidade do formulário

O formulário funciona também quando o navegador não oferece crypto.randomUUID (por exemplo, acesso HTTP pela rede local), usando getRandomValues para gerar o identificador. Novas tentativas com os mesmos dados preservam o identificador quando nenhum destino confirmou o salvamento. Os testes cobrem esses casos.

## Página de administração

Acesse a rota #/admin no mesmo endereço e navegador usados para enviar o formulário. O painel oferece busca por nome, e-mail ou tratamento, filtros de envio, atualização e remoção confirmada da cópia local. Registros existentes foram preservados. A rota por hash funciona no GitHub Pages sem configuração de redirecionamento.

Este painel é local e não tem autenticação: separar a tela não protege os dados de outras pessoas que usam o mesmo perfil do navegador. Para consultar contatos de todos os dispositivos, configure o Supabase e use seu painel autenticado. A aplicação não possui permissão pública para ler a tabela remota.

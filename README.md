Aqui está o README resumido e organizado para o projeto Sorriso – Clínica Odontológica, mantendo as informações acadêmicas, funcionalidades e instruções principais.

# 🦷 Sorriso — Clínica Odontológica

Landing page acadêmica desenvolvida com **React e Vite**, com identidade visual própria, layout responsivo e publicação automática no GitHub Pages.

## 🎓 Identificação Acadêmica

- **Instituição:** Senac Taguatinga
- **Curso:** Técnico de Desenvolvimento de Sistema
- **Disciplina:** Projeto Entregador
- **Orientador:** Profº Hudson Neves

## 🚀 Funcionalidades

- Apresentação da clínica e de quatro tratamentos odontológicos.
- Etapas do atendimento e perguntas frequentes.
- Menu responsivo e navegação acessível.
- Formulário de interesse com histórico local.
- Integração opcional com Supabase.
- Página de administração local.
- Publicação automática pelo GitHub Actions.

## 🛠️ Tecnologias

React, Vite, JavaScript, CSS, Supabase, PostgreSQL e GitHub Pages.

## ▶️ Como Executar

**Requisitos:** Node.js 22 e npm.

```
npm install
npm run dev
```

## 🧪 Testes e Produção

```
npm test
npm run build
npm run preview
```

## 🌐 Publicar no GitHub Pages

1. Envie o projeto para o GitHub, na branch `main`.
2. Acesse **Settings → Pages**.
3. Selecione **GitHub Actions** como fonte de publicação.
4. Acompanhe a execução do workflow na aba **Actions**.

## 🗄️ Banco de Dados

O formulário salva os dados localmente e pode ser integrado ao Supabase para armazenamento online. A integração exige configuração das variáveis de ambiente e execução do arquivo `supabase/schema.sql`.

**Importante:** o formulário registra solicitações de interesse, mas não confirma consultas automaticamente. O painel administrativo local não possui autenticação.

## 📂 Arquivos Principais

- `src/main.jsx` — componentes e interações.
- `src/styles.css` — identidade visual e responsividade.
- `.github/workflows/deploy.yml` — publicação automática.
- `supabase/schema.sql` — estrutura do banco de dados.

## 📈 Status

**Em desenvolvimento — MVP acadêmico.**

Adicionar o link da demonstraçãoExplicar o acesso à página administrativa

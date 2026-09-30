# 🚀 Publicando no Vercel com Firebase

## 📋 Visão Geral

O Vercel é uma plataforma de hospedagem perfeita para este projeto. O Firebase funciona perfeitamente no Vercel, pois é um banco de dados em nuvem independente da hospedagem.

**Arquitetura:**
```
Vercel (Frontend) ←→ Firebase Firestore (Banco de Dados)
     ↓
  Usuários acessam o site
```

---

## 🔥 Passo 1: Configurar o Firebase (se ainda não fez)

### 1.1 Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Nome: `osl-wiki` (ou outro)
4. Desative Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 1.2 Ativar Firestore Database

1. Menu lateral > **Criar** > **Firestore Database**
2. Clique em **"Criar banco de dados"**
3. Localização: **`southamerica-east1` (São Paulo)**
4. Inicie no **modo de teste** (vamos ajustar depois)
5. Clique em **"Ativar"**

### 1.3 Registrar Aplicativo Web

1. Na página inicial do projeto, clique no ícone **Web** (`</>`)
2. Nome do app: `osl-wiki-web`
3. **NÃO** marque "Firebase Hosting"
4. Clique em **"Registrar app"**
5. **COPIE** as credenciais (você vai precisar):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "osl-wiki.firebaseapp.com",
  projectId: "osl-wiki",
  storageBucket: "osl-wiki.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### 1.4 Configurar Regras de Segurança

1. Vá em **Firestore Database** > aba **Regras**
2. Cole estas regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wiki_items/{itemId} {
      allow read: if true;
      allow write: if true; // Modo desenvolvimento
      // Para produção, use: allow write: if request.auth != null;
    }
  }
}
```

3. Clique em **"Publicar"**

---

## 🌐 Passo 2: Preparar o Projeto para o Vercel

### 2.1 Verificar o arquivo `vercel.json`

Crie o arquivo `vercel.json` na raiz do projeto:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2.2 Commit do Código

```bash
git add .
git commit -m "feat: preparar para deploy no Vercel com Firebase"
git push origin main
```

---

## 🚀 Passo 3: Deploy no Vercel

### 3.1 Criar Conta no Vercel

1. Acesse [vercel.com](https://vercel.com/)
2. Clique em **"Sign Up"**
3. Faça login com GitHub (recomendado)

### 3.2 Importar Projeto

1. Clique em **"Add New..."** > **"Project"**
2. Importe o repositório do GitHub
3. O Vercel detecta automaticamente que é um projeto Vite

### 3.3 Configurar Variáveis de Ambiente

**⚠️ ESTE É O PASSO MAIS IMPORTANTE!**

Na tela de configuração do projeto, antes de clicar em **"Deploy"**:

1. Expanda a seção **"Environment Variables"**
2. Adicione **TODAS** as variáveis abaixo:

| Nome | Valor |
|------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` (sua API Key) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `osl-wiki.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `osl-wiki` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `osl-wiki.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abc123...` |

**Como encontrar cada valor:**
- Vá no Firebase Console > Project Settings > General
- Role até **"Your apps"**
- Clique no app Web registrado
- Copie cada valor individualmente

### 3.4 Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Pronto! Seu site está no ar

---

## 🔧 Passo 4: Configurar Domínio Personalizado (Opcional)

Se você tem um domínio próprio (ex: `guia.oslcontadores.com.br`):

1. No Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio
3. Configure o DNS conforme instruções do Vercel
4. Aguarde a propagação (pode levar até 24h)

---

## 🔄 Passo 5: Atualizações Futuras

### Deploy Automático

O Vercel faz deploy automaticamente quando você faz push para a branch `main`:

```bash
# Faça suas alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# O Vercel faz deploy automaticamente!
```

### Deploy Manual

Se quiser fazer deploy manual:

1. Vercel Dashboard > Seu Projeto
2. Aba **"Deployments"**
3. Clique em **"Redeploy"** no último deploy

---

## 📊 Passo 6: Verificar se Está Funcionando

### 6.1 Testar o Firebase

1. Acesse seu site no Vercel (ex: `https://seu-projeto.vercel.app`)
2. Vá para `#/wiki`
3. Você deve ver: **"Banco de dados: Firebase"** (bolinha verde)
4. Vá para `#/admin`
5. Login: `osl2026`
6. Adicione uma pergunta de teste
7. Verifique no Firebase Console se o documento foi criado

### 6.2 Testar o EmailJS

1. Vá para a seção de contato
2. Preencha o formulário
3. Verifique se o e-mail chega em `fiscal@osl.com.br`

---

## ⚠️ Considerações Importantes

### Variáveis de Ambiente no Vercel

- ✅ As variáveis devem começar com `VITE_` para funcionar no front-end
- ✅ Configure as variáveis em **Production**, **Preview** e **Development**
- ✅ Nunca commite o arquivo `.env.local`

### Firebase no Vercel

- ✅ O Firebase funciona perfeitamente no Vercel
- ✅ Não precisa de configuração especial
- ✅ As credenciais são injetadas no build time
- ✅ O Firestore é um banco externo, independente da hospedagem

### Segurança

- ✅ Configure as regras de segurança do Firestore
- ✅ Para produção, implemente Firebase Authentication
- ✅ Use variáveis de ambiente para todas as credenciais
- ✅ Nunca exponha a Service Account do Firebase

---

## 🐛 Solução de Problemas

### Problema: "Banco de dados: localStorage" aparecendo

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Vercel Dashboard > Seu Projeto > Settings > Environment Variables
2. Verifique se todas as variáveis `VITE_FIREBASE_*` estão configuradas
3. Faça um novo deploy

### Problema: Erro de permissão no Firestore

**Causa:** Regras de segurança muito restritivas

**Solução:**
1. Firebase Console > Firestore Database > Rules
2. Verifique se as regras permitem leitura/escrita
3. Para desenvolvimento, use `allow read, write: if true;`

### Problema: Build falha no Vercel

**Causa:** Erro de TypeScript ou dependências

**Solução:**
```bash
# Teste localmente primeiro
npm run build

# Se funcionar local, verifique os logs no Vercel
```

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **E-mail:** fiscal@osl.com.br
- **WhatsApp:** (35) 98871-1176

---

## ✅ Checklist Final

- [ ] Projeto criado no Firebase
- [ ] Firestore Database ativado
- [ ] App Web registrado
- [ ] Regras de segurança configuradas
- [ ] Código commitado no GitHub
- [ ] Projeto importado no Vercel
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] Firebase funcionando (bolinha verde)
- [ ] EmailJS funcionando
- [ ] Testes realizados

---

**OSL Contadores Associados** - Deploy no Vercel com Firebase

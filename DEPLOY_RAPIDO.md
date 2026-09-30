# 🚀 Guia Rápido: Deploy no Vercel com Firebase

## ⚡ Passo a Passo Resumido

### 1️⃣ Configurar Firebase (5 minutos)

```bash
1. Acesse: https://console.firebase.google.com/
2. Crie um projeto: "osl-wiki"
3. Ative Firestore Database (localização: southamerica-east1)
4. Registre um app Web
5. Copie as 6 credenciais
```

### 2️⃣ Preparar Código

```bash
git add .
git commit -m "feat: preparar para deploy"
git push origin main
```

### 3️⃣ Deploy no Vercel (3 minutos)

```bash
1. Acesse: https://vercel.com/
2. Importe o repositório do GitHub
3. Adicione as 6 variáveis de ambiente:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
4. Clique em "Deploy"
```

### 4️⃣ Verificar

```bash
1. Acesse seu site no Vercel
2. Vá para #/wiki
3. Deve aparecer: "Banco de dados: Firebase" (verde)
4. Teste adicionar uma pergunta em #/admin
```

---

## 📋 Variáveis de Ambiente (Copie e Preencha)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 🔗 Links Úteis

- **Firebase Console:** https://console.firebase.google.com/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Completa:** ./DEPLOY_VERCEL.md

---

## ❓ Problemas Comuns

**"Banco de dados: localStorage" aparecendo?**
→ Variáveis de ambiente não configuradas no Vercel

**Erro de permissão no Firestore?**
→ Verifique as regras em Firebase Console > Firestore > Rules

**Build falha?**
→ Teste localmente: `npm run build`

---

**Precisa de ajuda?**
📧 fiscal@osl.com.br | 💬 (35) 98871-1176

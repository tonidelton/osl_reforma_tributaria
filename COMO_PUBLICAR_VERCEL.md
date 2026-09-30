# 📦 Como Publicar no Vercel com Firebase

## 🎯 Resumo Rápido

O **Vercel** hospeda o site (frontend) e o **Firebase** armazena os dados (banco). São serviços independentes que trabalham juntos.

```
┌─────────────────┐         ┌──────────────────┐
│     VERCEL      │         │     FIREBASE     │
│   (Frontend)    │◄───────►│  (Banco de Dados)│
│                 │         │                  │
│ • Site no ar    │         │ • Perguntas      │
│ • Wiki          │         │ • Respostas      │
│ • Admin         │         │ • Categorias     │
└─────────────────┘         └──────────────────┘
         ↑                            ↑
         │                            │
    Usuários                    Dados persistentes
    acessam o site              (nuvem do Google)
```

---

## 🚀 Passo a Passo Completo

### **PASSO 1: Criar Conta no Firebase (Gratuito)**

1. Acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Clique em **"Criar um projeto"**
4. Nome do projeto: `osl-wiki` (ou outro)
5. Aceite os termos e clique em **"Continuar"**
6. Desative o Google Analytics (opcional)
7. Clique em **"Criar projeto"**

---

### **PASSO 2: Configurar o Banco de Dados**

1. No menu lateral esquerdo, clique em **"Criar"** > **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione a localização: **`southamerica-east1 (São Paulo)`**
4. Escolha **"Iniciar no modo de teste"** (vamos ajustar depois)
5. Clique em **"Ativar"**

---

### **PASSO 3: Registrar o Aplicativo Web**

1. Na página inicial do projeto, clique no ícone **Web** (`</>`)
2. Nome do app: `osl-wiki-web`
3. **NÃO** marque "Também configurar o Firebase Hosting"
4. Clique em **"Registrar app"**
5. **COPIE** as credenciais que aparecerão (você vai precisar delas):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",                    // ← Copie isto
  authDomain: "osl-wiki.firebaseapp.com", // ← Copie isto
  projectId: "osl-wiki",                  // ← Copie isto
  storageBucket: "osl-wiki.appspot.com",  // ← Copie isto
  messagingSenderId: "123456789",         // ← Copie isto
  appId: "1:123456789:web:abc123..."      // ← Copie isto
};
```

---

### **PASSO 4: Configurar Regras de Segurança**

1. No menu lateral, clique em **"Firestore Database"**
2. Vá na aba **"Regras"**
3. Cole estas regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wiki_items/{itemId} {
      allow read: if true;
      allow write: if true; // Modo desenvolvimento
    }
  }
}
```

4. Clique em **"Publicar"**

---

### **PASSO 5: Preparar o Código**

No seu computador, abra o terminal na pasta do projeto:

```bash
# Verifique se está na branch main
git status

# Se necessário, faça commit das alterações
git add .
git commit -m "feat: preparar para deploy no Vercel"
git push origin main
```

---

### **PASSO 6: Publicar no Vercel**

1. Acesse: https://vercel.com/
2. Clique em **"Sign Up"** (se não tiver conta)
3. Faça login com **GitHub** (recomendado)
4. Clique em **"Add New..."** > **"Project"**
5. Importe o repositório do GitHub
6. O Vercel detecta automaticamente que é um projeto Vite

---

### **PASSO 7: ⚠️ CONFIGURAR VARIÁVEIS DE AMBIENTE (MUITO IMPORTANTE!)**

**ANTES** de clicar em "Deploy":

1. Expanda a seção **"Environment Variables"**
2. Adicione **TODAS** as variáveis abaixo (uma por uma):

| Nome da Variável | Valor (copie do Firebase) |
|------------------|---------------------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` (sua API Key) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `osl-wiki.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `osl-wiki` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `osl-wiki.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abc123...` |

**Importante:**
- ✅ Todas devem começar com `VITE_`
- ✅ Configure para os ambientes: **Production**, **Preview** e **Development**
- ✅ Use exatamente os valores copiados do Firebase

---

### **PASSO 8: Fazer o Deploy**

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Pronto! Seu site está no ar em: `https://seu-projeto.vercel.app`

---

## ✅ Como Verificar se Está Funcionando

### Teste 1: Verificar o Banco de Dados

1. Acesse seu site no Vercel
2. Vá para: `https://seu-projeto.vercel.app/#/wiki`
3. No topo da página, deve aparecer:
   - ✅ **"Banco de dados: Firebase"** (bolinha verde)
   - ❌ Se aparecer "Modo demonstração", as variáveis não foram configuradas

### Teste 2: Adicionar uma Pergunta

1. Vá para: `https://seu-projeto.vercel.app/#/admin`
2. Login: `osl2026`
3. Clique em **"Nova Pergunta"**
4. Preencha os campos e salve
5. Volte para o Firebase Console
6. Clique em **"Firestore Database"**
7. Você deve ver a coleção `wiki_items` com sua pergunta

### Teste 3: Verificar Persistência

1. Recarregue a página (`F5`)
2. A pergunta deve continuar aparecendo
3. Acesse de outro navegador ou dispositivo
4. A pergunta deve estar lá (dados na nuvem!)

---

## 🔄 Como Atualizar o Site

Sempre que fizer alterações no código:

```bash
# Faça suas alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

**O Vercel faz deploy automaticamente!** 🎉

---

## 🐛 Problemas Comuns

### Problema 1: "Banco de dados: localStorage" aparecendo

**Causa:** Variáveis de ambiente não configuradas no Vercel

**Solução:**
1. Vercel Dashboard > Seu Projeto > Settings > Environment Variables
2. Verifique se todas as 6 variáveis `VITE_FIREBASE_*` estão configuradas
3. Clique em **"Redeploy"** para aplicar as mudanças

---

### Problema 2: Erro de permissão no Firestore

**Causa:** Regras de segurança muito restritivas

**Solução:**
1. Firebase Console > Firestore Database > Rules
2. Verifique se as regras permitem leitura e escrita
3. Para desenvolvimento, use:
```javascript
allow read, write: if true;
```

---

### Problema 3: Build falha no Vercel

**Causa:** Erro de TypeScript ou dependências

**Solução:**
```bash
# Teste localmente primeiro
npm run build

# Se funcionar local, verifique os logs no Vercel
```

---

## 📊 Custos

### Firebase (Plano Gratuito - Spark)
- ✅ **1 GB** de armazenamento
- ✅ **50.000 leituras/dia**
- ✅ **20.000 escritas/dia**
- ✅ Suficiente para milhares de perguntas

### Vercel (Plano Gratuito - Hobby)
- ✅ **100 GB** de banda/mês
- ✅ **100 GB-hours** de computação
- ✅ Deploy ilimitado
- ✅ Suficiente para tráfego moderado

**Total: R$ 0,00** para começar! 🎉

---

## 🔒 Segurança para Produção

Quando estiver pronto para produção:

### 1. Implementar Autenticação
- Use Firebase Authentication
- Proteja a área administrativa

### 2. Ajustar Regras do Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wiki_items/{itemId} {
      allow read: if true;
      allow write: if request.auth != null; // Apenas autenticados
    }
  }
}
```

### 3. Configurar Domínio Personalizado
- Vercel: Settings > Domains
- Adicione seu domínio (ex: `guia.oslcontadores.com.br`)

---

## 📞 Suporte

- **Documentação Completa:** `DEPLOY_VERCEL.md`
- **Guia Rápido:** `DEPLOY_RAPIDO.md`
- **E-mail:** fiscal@osl.com.br
- **WhatsApp:** (35) 98871-1176

---

## ✅ Checklist Final

- [ ] Conta criada no Firebase
- [ ] Firestore Database ativado
- [ ] App Web registrado
- [ ] Credenciais copiadas
- [ ] Regras de segurança configuradas
- [ ] Código commitado no GitHub
- [ ] Projeto importado no Vercel
- [ ] 6 variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Firebase funcionando (bolinha verde)
- [ ] Teste de leitura OK
- [ ] Teste de escrita OK
- [ ] Dados persistindo

---

**Pronto! Seu site está no ar com banco de dados na nuvem!** 🚀

**OSL Contadores Associados** - Deploy concluído com sucesso

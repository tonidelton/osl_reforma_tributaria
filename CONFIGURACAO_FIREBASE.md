# 🔥 Configuração do Firebase - Wiki OSL

## 📋 Visão Geral

Este projeto usa **Firebase Firestore** como banco de dados para armazenar as perguntas e respostas da Wiki. O Firebase oferece:

- ✅ **1 GB de armazenamento** gratuito
- ✅ **50.000 leituras/dia** gratuitas
- ✅ **20.000 escritas/dia** gratuitas
- ✅ Sincronização em tempo real
- ✅ Sem necessidade de servidor próprio

Se o Firebase não estiver configurado, o sistema funciona em **modo demonstração** usando localStorage (os dados ficam apenas no navegador).

---

## 🚀 Passo a Passo: Configurar o Firebase

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** (ou "Add project")
3. Nome do projeto: `osl-wiki` (ou outro de sua preferência)
4. Aceite os termos e clique em **"Continuar"**
5. Desative o Google Analytics (opcional) e clique em **"Criar projeto"**
6. Aguarde a criação e clique em **"Continuar"**

### 2. Criar Banco de Dados Firestore

1. No menu lateral, clique em **"Criar"** > **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de teste"** (vamos configurar as regras depois)
4. Escolha a localização: **`southamerica-east1` (São Paulo)** para melhor performance
5. Clique em **"Ativar"**

### 3. Registrar Aplicativo Web

1. Na página inicial do projeto, clique no ícone **Web** (`</>`)
2. Nome do app: `osl-wiki-web`
3. **NÃO** marque "Também configurar o Firebase Hosting"
4. Clique em **"Registrar app"**
5. **COPIE** as credenciais que aparecerão (você vai precisar delas)

As credenciais serão algo como:
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

### 4. Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env.local`
2. Copie o conteúdo do arquivo `.env.example`
3. Preencha com suas credenciais:

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=osl-wiki.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=osl-wiki
VITE_FIREBASE_STORAGE_BUCKET=osl-wiki.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

**⚠️ IMPORTANTE:** 
- O arquivo `.env.local` **NÃO** deve ser commitado no Git
- Ele já está no `.gitignore`
- Cada desenvolvedor deve ter seu próprio `.env.local`

### 5. Configurar Regras de Segurança do Firestore

1. No Firebase Console, vá em **"Firestore Database"** > aba **"Regras"**
2. Substitua as regras por estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Coleção wiki_items
    match /wiki_items/{itemId} {
      // Leitura: permitida para todos
      allow read: if true;
      
      // Escrita: apenas para usuários autenticados
      // Por enquanto, vamos permitir escrita para todos (modo desenvolvimento)
      allow write: if true;
      
      // Em produção, use autenticação:
      // allow write: if request.auth != null;
    }
  }
}
```

3. Clique em **"Publicar"**

**⚠️ NOTA:** As regras acima permitem escrita para todos (modo desenvolvimento). Para produção, implemente autenticação Firebase e use `request.auth != null`.

### 6. Testar a Configuração

1. Execute o projeto: `npm run dev`
2. Acesse `http://localhost:5173/#/wiki`
3. Você deve ver o indicador **"Banco de dados: Firebase"** (bolinha verde)
4. Acesse `http://localhost:5173/#/admin`
5. Login com senha: `osl2026`
6. Adicione uma pergunta de teste
7. Verifique no Firebase Console se o documento foi criado

---

## 📊 Estrutura dos Dados no Firestore

O Firestore cria automaticamente a seguinte estrutura:

```
Firestore Database
└── wiki_items (coleção)
    ├── documento_1
    │   ├── question: "Como emitir nota fiscal?"
    │   ├── answer: "Para emitir notas..."
    │   ├── category: "Reforma Tributária"
    │   └── createdAt: Timestamp
    ├── documento_2
    │   ├── question: "O que é PIX?"
    │   ├── answer: "PIX é um sistema..."
    │   ├── category: "PIX"
    │   └── createdAt: Timestamp
    └── ...
```

---

## 🔄 Modo Demonstração (sem Firebase)

Se você **NÃO** configurar o Firebase, o sistema funciona automaticamente em **modo demonstração**:

- ✅ Todos os recursos funcionam normalmente
- ✅ Os dados são salvos no **localStorage** do navegador
- ⚠️ Os dados ficam apenas no navegador de quem os criou
- ⚠️ Se o usuário limpar o cache, os dados são perdidos
- ⚠️ Cada navegador tem seus próprios dados

**Indicador visual:** Você verá "Modo demonstração (localStorage)" com bolinha amarela.

---

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

---

## 🔒 Segurança em Produção

Para produção, recomendamos:

1. **Implementar Autenticação Firebase**
   - Use Firebase Authentication para proteger a área administrativa
   - Modifique as regras do Firestore para exigir autenticação

2. **Regras de Segurança Mais Restritivas**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wiki_items/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. **Variáveis de Ambiente em Produção**
   - Use as variáveis de ambiente do seu serviço de hospedagem
   - Nunca commit o arquivo `.env.local`

---

## 📞 Suporte

Se tiver dúvidas sobre a configuração:

- 📧 E-mail: fiscal@osl.com.br
- 💬 WhatsApp: (35) 98871-1176
- 📚 Documentação Firebase: https://firebase.google.com/docs

---

## ✅ Checklist de Configuração

- [ ] Projeto criado no Firebase Console
- [ ] Firestore Database ativado
- [ ] Aplicativo Web registrado
- [ ] Credenciais copiadas
- [ ] Arquivo `.env.local` criado e preenchido
- [ ] Regras de segurança configuradas
- [ ] Teste de leitura funcionando
- [ ] Teste de escrita funcionando
- [ ] Indicador "Firebase" aparecendo na interface

---

**OSL Contadores Associados** - Wiki com Firebase Firestore

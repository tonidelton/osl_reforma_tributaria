# 🚨 SOLUÇÃO RÁPIDA - Firebase não Funcionando

## ⚡ Faça Isto AGORA (5 minutos)

### 1️⃣ Acesse o Firebase Console

👉 https://console.firebase.google.com/

Selecione o projeto **osl-wiki**

---

### 2️⃣ Verifique se o Firestore foi Criado

No menu lateral esquerdo, clique em:

```
Build > Firestore Database
```

**Se aparecer "Criar banco de dados":**
- ✅ Clique nele
- Selecione localização: **southamerica-east1 (São Paulo)**
- Escolha: **Iniciar no modo de teste**
- Clique em **"Ativar"**

**Se já aparecer dados ou "Coleções":**
- ✅ O Firestore já foi criado, vá para o próximo passo

---

### 3️⃣ Configure as Regras de Segurança

1. No Firestore Database, clique na aba **"Regras"**
2. **Apague** tudo que está na caixa de texto
3. **Cole** exatamente isto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wiki_items/{itemId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

4. Clique em **"Publicar"**

---

### 4️⃣ Teste

1. Acesse seu site no Vercel
2. Vá para `#/wiki`
3. Deve aparecer: **"Banco de dados: Firebase"** (bolinha verde)
4. Vá para `#/admin` (senha: `osl2026`)
5. Clique em **"Nova Pergunta"**
6. Preencha e salve
7. Volte para `#/wiki` e verifique se aparece

---

## 🔍 Se Ainda Não Funcionar

### Abra o Console do Navegador

1. Pressione **F12** (ou Ctrl+Shift+I)
2. Clique na aba **"Console"**
3. Recarregue a página (F5)
4. Veja as mensagens:

**✅ Se aparecer isto:**
```
🔍 Buscando itens do Firebase...
✅ 0 itens encontrados no Firebase
```
→ Está funcionando! O banco está vazio, é normal.

**❌ Se aparecer isto:**
```
❌ Erro ao buscar itens do Firebase: permission-denied
```
→ As regras de segurança estão erradas. Volte ao passo 3.

**❌ Se aparecer isto:**
```
❌ Erro ao buscar itens do Firebase: unavailable
```
→ O Firestore não foi criado. Volte ao passo 2.

---

## 📸 Print Screen

Se precisar de ajuda, tire um print de:

1. **Firebase Console** mostrando o Firestore Database
2. **Aba "Regras"** do Firestore
3. **Console do navegador** (F12) com as mensagens de erro

Envie para: fiscal@osl.com.br

---

## ✅ Checklist Rápido

- [ ] Firebase Console aberto
- [ ] Projeto osl-wiki selecionado
- [ ] Firestore Database criado
- [ ] Regras configuradas (allow read, write: if true)
- [ ] Regras publicadas
- [ ] Site testado no Vercel
- [ ] Console do navegador aberto (F12)
- [ ] Mensagens de log verificadas

---

## 🆘 Precisa de Ajuda?

- **E-mail:** fiscal@osl.com.br
- **WhatsApp:** (35) 98871-1176
- **Documentação completa:** `TROUBLESHOOTING_FIREBASE.md`

---

**Resumo:** 90% dos problemas são resolvidos criando o Firestore e configurando as regras!

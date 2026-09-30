# 🔧 Solução de Problemas - Firebase não Funcionando

## ⚠️ Problema Identificado

Se as perguntas não aparecem na Wiki e não consegue salvar novas, provavelmente é um destes problemas:

1. **Firestore Database não foi criado** no Firebase Console
2. **Regras de segurança** estão bloqueando leitura/escrita
3. **Índice não foi criado** (já corrigido no código)

---

## ✅ Solução Passo a Passo

### **PASSO 1: Verificar se o Firestore foi Criado**

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto **osl-wiki**
3. No menu lateral esquerdo, procure por **"Firestore Database"** ou **"Build" > "Firestore Database"**
4. **Se NÃO aparecer "Criar banco de dados":** ✅ O Firestore já foi criado
5. **Se aparecer "Criar banco de dados":** ❌ O Firestore NÃO foi criado ainda

#### Se o Firestore NÃO foi criado:

1. Clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione a localização: **`southamerica-east1 (São Paulo)`**
4. Escolha **"Iniciar no modo de teste"**
5. Clique em **"Ativar"**
6. Aguarde alguns segundos

---

### **PASSO 2: Configurar Regras de Segurança**

1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **"Regras"** (Rules)
3. **Apague** tudo que está na caixa de texto
4. **Cole** estas regras exatamente como estão:

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

5. Clique em **"Publicar"** (Publish)

**Importante:** Essas regras permitem leitura e escrita para todos (modo desenvolvimento). Para produção, você deve implementar autenticação.

---

### **PASSO 3: Verificar se Está Funcionando**

1. Acesse seu site no Vercel
2. Abra o **Console do Navegador** (F12 ou Ctrl+Shift+I)
3. Vá para a aba **"Console"**
4. Acesse a página `#/wiki`
5. Você deve ver mensagens como:

```
🔍 Buscando itens do Firebase...
✅ 0 itens encontrados no Firebase
```

ou

```
🔍 Buscando itens do Firebase...
✅ 4 itens encontrados no Firebase
```

6. Se aparecer ❌ ou mensagens de erro, veja a seção de erros abaixo

---

### **PASSO 4: Testar Salvamento**

1. Acesse `#/admin`
2. Login: `osl2026`
3. Clique em **"Nova Pergunta"**
4. Preencha os campos:
   - Pergunta: "Teste de conexão"
   - Resposta: "Esta é uma pergunta de teste"
   - Categoria: "Teste"
5. Clique em **"Criar Pergunta"**
6. No Console do navegador (F12), você deve ver:

```
💾 Salvando novo item no Firebase...
Dados: {question: "Teste de conexão", ...}
✅ Item salvo com sucesso! ID: abc123...
```

7. Volte para `#/wiki` e verifique se a pergunta aparece

---

## 🐛 Erros Comuns e Soluções

### Erro 1: "permission-denied"

**Mensagem no Console:**
```
❌ Erro ao buscar itens do Firebase: FirebaseError: Missing or insufficient permissions
```

**Causa:** As regras de segurança do Firestore estão bloqueando

**Solução:**
1. Firebase Console > Firestore Database > Regras
2. Cole as regras mostradas no PASSO 2
3. Clique em "Publicar"

---

### Erro 2: "unavailable" ou "not-found"

**Mensagem no Console:**
```
❌ Erro ao buscar itens do Firebase: FirebaseError: The service is unavailable
```

**Causa:** O Firestore Database não foi criado

**Solução:**
1. Firebase Console > Build > Firestore Database
2. Clique em "Criar banco de dados"
3. Siga o PASSO 1

---

### Erro 3: "index-required"

**Mensagem no Console:**
```
❌ Erro ao buscar itens do Firebase: FirebaseError: The query requires an index
```

**Causa:** Está usando `orderBy` sem índice

**Solução:** ✅ **Já corrigido no código!** O código agora não usa `orderBy` e ordena manualmente.

Se ainda aparecer, faça o build novamente:
```bash
npm run build
git add .
git commit -m "fix: remover orderBy que exige índice"
git push origin main
```

---

### Erro 4: "Banco de dados: localStorage" aparecendo

**Causa:** O Firebase não está configurado ou há erro na conexão

**Solução:**
1. Verifique se o arquivo `src/firebase.config.ts` tem as credenciais corretas
2. Verifique se o Firestore foi criado no console
3. Verifique as regras de segurança
4. Faça o build e deploy novamente

---

## 🔍 Como Ver os Logs no Navegador

### Chrome/Edge:
1. Pressione **F12** ou **Ctrl+Shift+I**
2. Clique na aba **"Console"**
3. Recarregue a página (F5)
4. Você verá todas as mensagens de log

### Firefox:
1. Pressione **F12** ou **Ctrl+Shift+I**
2. Clique na aba **"Console"**
3. Recarregue a página (F5)

### Safari:
1. Pressione **Cmd+Option+C**
2. Recarregue a página

---

## 📊 Verificar Dados no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto **osl-wiki**
3. Vá em **Firestore Database**
4. Você deve ver a coleção **wiki_items**
5. Clique nela para ver os documentos

**Se a coleção não existir:**
- Significa que nenhum item foi salvo ainda
- Tente salvar uma pergunta via admin
- Verifique os logs no Console do navegador

---

## ✅ Checklist de Verificação

- [ ] Firebase Console acessível
- [ ] Projeto "osl-wiki" selecionado
- [ ] Firestore Database criado
- [ ] Regras de segurança configuradas (allow read, write: if true)
- [ ] Console do navegador aberto (F12)
- [ ] Mensagens de log aparecendo
- [ ] Conseguindo ler itens (se houver)
- [ ] Conseguindo salvar novos itens
- [ ] Dados aparecendo no Firebase Console

---

## 🆘 Ainda Não Funciona?

Se após seguir todos os passos ainda não funciona:

1. **Tire um print** do Console do navegador (F12) com as mensagens de erro
2. **Tire um print** das regras do Firestore
3. **Envie** para: fiscal@osl.com.br
4. **WhatsApp:** (35) 98871-1176

---

## 🔄 Fazer Novo Deploy Após Correções

Se você fez alterações no código:

```bash
# Commit das alterações
git add .
git commit -m "fix: melhorar tratamento de erros do Firebase"
git push origin main

# O Vercel faz deploy automaticamente
```

Aguarde 2-3 minutos e teste novamente.

---

## 💡 Dica Importante

O código agora tem **fallback automático** para localStorage. Se o Firebase falhar, o sistema continua funcionando com dados locais no navegador. Isso garante que o site nunca fique completamente indisponível.

Para ver se está usando Firebase ou localStorage, olhe o indicador no topo da página da Wiki:
- 🟢 **Bolinha verde** = Firebase (nuvem)
- 🟡 **Bolinha amarela** = localStorage (navegador local)

---

**OSL Contadores Associados** - Troubleshooting Firebase

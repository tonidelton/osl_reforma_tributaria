# 🏢 Guia do Empresário — OSL Contadores Associados

Site informativo completo sobre Reforma Tributária (CBS/IBS), PIX, formação de preços, apuração assistida, créditos tributários, split payment e contratos comerciais.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **Firebase Firestore** (banco de dados)
- **EmailJS** (envio de e-mails)
- **XLSX** (importação/exportação Excel)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🗄️ Banco de Dados

O projeto usa **Firebase Firestore** como banco de dados principal. Se o Firebase não estiver configurado, o sistema funciona automaticamente em **modo demonstração** usando localStorage.

### Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Registre um aplicativo Web
4. Copie as credenciais para o arquivo `.env.local`

**Documentação completa:** [CONFIGURACAO_FIREBASE.md](./CONFIGURACAO_FIREBASE.md)

### Estrutura do Banco

```
Firestore Database
└── wiki_items (coleção)
    ├── question: string
    ├── answer: string
    ├── category: string
    └── createdAt: Timestamp
```

## 📧 Envio de E-mails

O formulário de contato usa **EmailJS** para enviar e-mails reais.

### Configurar EmailJS

1. Crie uma conta em [emailjs.com](https://www.emailjs.com/)
2. Configure um serviço de e-mail
3. Crie um template com as variáveis: `from_name`, `from_email`, `message`, `to_email`
4. Atualize as credenciais em `src/emailjs.config.ts`

**Documentação completa:** [CONFIGURACAO_EMAILJS.md](./CONFIGURACAO_EMAILJS.md)

## 📊 Importação de Dados

A área administrativa permite importar perguntas e respostas em massa via Excel.

**Documentação completa:** [README_IMPORTACAO.md](./README_IMPORTACAO.md)

## 🌐 Rotas

- `/` — Página principal (Guia do Empresário)
- `#/wiki` — Central de Ajuda (Wiki pública)
- `#/admin` — Área Administrativa (senha: `osl2026`)
- `#/calculadora` — Calculadora de Formação de Preço

## 📁 Estrutura do Projeto

```
src/
├── App.tsx              # Componente principal com rotas
├── Wiki.tsx             # Página da Wiki e Admin
├── Calculadora.tsx      # Calculadora de preço
├── ImportadorExcel.tsx  # Modal de importação Excel
├── db.ts                # Serviço de banco de dados (Firebase/localStorage)
├── firebase.config.ts   # Configuração do Firebase
├── emailjs.config.ts    # Configuração do EmailJS
├── index.css            # Estilos globais
└── main.tsx             # Entry point
```

## 🔐 Segurança

### Firebase
- Configure as regras de segurança do Firestore
- Implemente autenticação para proteger a área administrativa
- Nunca commite o arquivo `.env.local`

### EmailJS
- A Public Key é pública e pode ser usada no front-end
- Configure limites de envio no painel do EmailJS

## 📞 Contato

- **E-mail:** fiscal@osl.com.br
- **WhatsApp:** (35) 98871-1176

## 📄 Licença

© 2026 OSL Contadores Associados. Todos os direitos reservados.

---

**Desenvolvido pela equipe contábil da OSL**

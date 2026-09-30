# Configuração do EmailJS - OSL Contadores Associados

## 📧 Como configurar o envio de e-mails

### Passo 1: Criar conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie sua conta (plano gratuito permite 200 e-mails/mês)
3. Confirme seu e-mail

### Passo 2: Adicionar serviço de e-mail

1. No painel, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor de e-mail (recomendado: Gmail ou Outlook)
4. Conecte sua conta (a conta que enviará os e-mails)
5. Copie o **Service ID** (ex: `service_abc123`)

### Passo 3: Criar template de e-mail

1. Vá em **Email Templates**
2. Clique em **Create New Template**
3. Configure o template com as seguintes variáveis:

**Subject:**
```
Nova mensagem do site OSL - {{from_name}}
```

**Content (HTML):**
```html
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h2 style="color: #1e3a5f;">Nova mensagem do site</h2>
  
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Nome:</strong> {{from_name}}</p>
    <p><strong>E-mail:</strong> {{from_email}}</p>
    <p><strong>Mensagem:</strong></p>
    <p style="background: white; padding: 15px; border-radius: 4px;">{{message}}</p>
  </div>
  
  <p style="color: #666; font-size: 12px;">
    Esta mensagem foi enviada através do formulário de contato do site OSL Contadores Associados.
  </p>
</body>
</html>
```

**To Email:**
```
{{to_email}}
```

4. Salve o template e copie o **Template ID** (ex: `template_xyz789`)

### Passo 4: Obter Public Key

1. Vá em **Account** > **API Keys**
2. Copie a **Public Key**

### Passo 5: Configurar o projeto

Abra o arquivo `src/emailjs.config.ts` e substitua os valores:

```typescript
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'sua_public_key_aqui',
  SERVICE_ID: 'seu_service_id_aqui',
  TEMPLATE_ID: 'seu_template_id_aqui',
  TO_EMAIL: 'fiscal@osl.com.br',
};
```

### Passo 6: Testar

1. Faça o build do projeto: `npm run build`
2. Acesse o site e preencha o formulário de contato
3. Verifique se o e-mail chega em `fiscal@osl.com.br`

## 💬 Botão do WhatsApp

O botão do WhatsApp já está configurado para o número **(35) 98871-1176** com uma mensagem pré-preenchida:

> "Olá! Gostaria de tirar dúvidas sobre a Reforma Tributária e as mudanças no PIX."

Para alterar o número ou a mensagem, edite o arquivo `src/emailjs.config.ts`:

```typescript
export const WHATSAPP_NUMBER = '5535988711176'; // Formato: 55 + DDD + número
```

## 🔒 Segurança

- A Public Key do EmailJS é pública e pode ser usada no front-end
- Para maior segurança, considere adicionar limites de envio no painel do EmailJS
- O plano gratuito permite 200 e-mails/mês

## 📞 Suporte

Se tiver dúvidas sobre a configuração, entre em contato com a equipe de desenvolvimento.

---

**OSL Contadores Associados** - Conteúdo preparado pela equipe contábil

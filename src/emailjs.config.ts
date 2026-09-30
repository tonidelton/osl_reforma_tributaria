// ============================================
// CONFIGURAÇÃO EMAILJS
// ============================================
// Para configurar:
// 1. Crie uma conta em https://www.emailjs.com/
// 2. Crie um serviço de e-mail (Gmail, Outlook, etc.)
// 3. Crie um template com as variáveis: from_name, from_email, message, to_email
// 4. Copie suas credenciais abaixo

export const EMAILJS_CONFIG = {
  // Sua Public Key (encontrada em Account > API Keys)
  PUBLIC_KEY: 'SUA_PUBLIC_KEY_AQUI',
  
  // ID do serviço criado (ex: 'service_abc123')
  SERVICE_ID: 'SEU_SERVICE_ID_AQUI',
  
  // ID do template criado (ex: 'template_xyz789')
  TEMPLATE_ID: 'SEU_TEMPLATE_ID_AQUI',
  
  // E-mail de destino
  TO_EMAIL: 'fiscal@osl.com.br',
};

// Número do WhatsApp para contato (formato internacional sem +)
export const WHATSAPP_NUMBER = '5535988711176'; // 55 (Brasil) + 35 (DDD) + 988711176

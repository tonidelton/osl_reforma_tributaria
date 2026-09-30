// ============================================
// CONFIGURAÇÃO FIREBASE
// ============================================
// Para configurar:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um novo projeto (ou use um existente)
// 3. Vá em "Project settings" > "General" > "Your apps"
// 4. Clique em "Add app" > Web (ícone </>)
// 5. Registre o app e copie as configurações abaixo
// 6. Ative o Firestore Database em "Build" > "Firestore Database"
// 7. Configure as regras de segurança (ver FIRESTORE_RULES.md)

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Suas configurações do Firebase (substitua pelos valores do seu projeto)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "SUA_API_KEY_AQUI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "SEU_PROJETO.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "SEU_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "SEU_PROJETO.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "SEU_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "SEU_APP_ID"
};

// Verifica se o Firebase está configurado
export const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey !== "SUA_API_KEY_AQUI" &&
    firebaseConfig.projectId !== "SEU_PROJECT_ID" &&
    firebaseConfig.apiKey !== "" &&
    firebaseConfig.projectId !== ""
  );
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

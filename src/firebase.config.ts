// ============================================
// CONFIGURAÇÃO FIREBASE - OSL Wiki
// ============================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCtfNCYpmYN1RGPsd5_zLs9vOVAQjwBAMo",
  authDomain: "osl-wiki.firebaseapp.com",
  projectId: "osl-wiki",
  storageBucket: "osl-wiki.firebasestorage.app",
  messagingSenderId: "66864618249",
  appId: "1:66864618249:web:3f2e0f830aa06bbc7011d8"
};

// Verifica se o Firebase está configurado
export const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey !== "" &&
    firebaseConfig.projectId !== "" &&
    firebaseConfig.apiKey !== "SUA_API_KEY_AQUI"
  );
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

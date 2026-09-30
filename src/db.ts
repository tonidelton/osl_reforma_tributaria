// ============================================
// SERVIÇO DE BANCO DE DADOS
// ============================================
// Encapsula operações CRUD com fallback para localStorage
// quando o Firebase não está configurado

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.config';

// ============================================
// TIPOS
// ============================================

export interface WikiItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

// ============================================
// CONSTANTES
// ============================================

const COLLECTION_NAME = 'wiki_items';
const LOCAL_STORAGE_KEY = 'osl-wiki-items';

// ============================================
// DADOS INICIAIS
// ============================================

const initialItems: WikiItem[] = [
  {
    id: '1',
    question: 'Como emitir nota fiscal com os campos de IBS e CBS?',
    answer: 'Para emitir notas fiscais com os campos de IBS e CBS, você precisa verificar se seu sistema emissor de notas está atualizado. A partir de 03/08/2026, esses campos são obrigatórios para empresas do regime regular. Entre em contato com o fornecedor do seu sistema ou com nossa equipe para verificar a compatibilidade.',
    category: 'Reforma Tributária',
    createdAt: '2026-09-01'
  },
  {
    id: '2',
    question: 'O que é o PIX Automático e como aderir?',
    answer: 'O PIX Automático é uma modalidade de pagamento semelhante ao débito automático, ideal para cobranças recorrentes como mensalidades e assinaturas. Para aderir, você precisa configurar essa modalidade no seu banco ou plataforma de pagamento. Se sua empresa faz cobrança recorrente, essa modalidade é obrigatória.',
    category: 'PIX',
    createdAt: '2026-09-01'
  },
  {
    id: '3',
    question: 'Preciso pagar imposto novo em 2026?',
    answer: 'Não. 2026 é uma fase de teste com alíquotas experimentais (CBS 0,9% + IBS 0,1%, totalizando 1%). O recolhimento fica dispensado para quem cumpre as obrigações acessórias. Na prática, é o ano de adaptar sistemas e notas fiscais, sem pagamento efetivo dos novos tributos.',
    category: 'Reforma Tributária',
    createdAt: '2026-09-01'
  },
  {
    id: '4',
    question: 'Como funciona o MED 2.0 do PIX?',
    answer: 'O MED 2.0 (Mecanismo Especial de Devolução) é um sistema de segurança do PIX que permite bloquear valores em caso de suspeita de fraude. Se você identificar uma transação suspeita, pode solicitar o bloqueio através do seu banco. Isso protege tanto quem enviou quanto quem recebeu o pagamento.',
    category: 'PIX',
    createdAt: '2026-09-01'
  }
];

// ============================================
// FUNÇÕES DO BANCO DE DADOS
// ============================================

/**
 * Busca todos os itens da Wiki
 */
export async function getAllItems(): Promise<WikiItem[]> {
  // Se Firebase não está configurado, usa localStorage
  if (!isFirebaseConfigured()) {
    console.log('📦 Firebase não configurado, usando localStorage');
    return getItemsFromLocalStorage();
  }

  try {
    console.log('🔍 Buscando itens do Firebase...');
    // Removido orderBy para não exigir índice
    const q = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(q);
    
    console.log(`✅ ${querySnapshot.size} itens encontrados no Firebase`);
    
    const items: WikiItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        question: data.question,
        answer: data.answer,
        category: data.category,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString().split('T')[0]
          : data.createdAt
      });
    });
    
    // Ordena manualmente por data (mais recente primeiro)
    items.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Ordem decrescente
    });
    
    return items;
  } catch (error: any) {
    console.error('❌ Erro ao buscar itens do Firebase:', error);
    console.error('Detalhes do erro:', error.code, error.message);
    
    // Mensagem mais clara para o usuário
    if (error.code === 'permission-denied') {
      console.error('⚠️ Permissão negada. Verifique as regras de segurança do Firestore.');
    } else if (error.code === 'unavailable') {
      console.error('⚠️ Firestore não está disponível. Verifique se o banco foi criado no console.');
    }
    
    // Fallback para localStorage em caso de erro
    console.log('📦 Usando fallback para localStorage');
    return getItemsFromLocalStorage();
  }
}

/**
 * Adiciona um novo item
 */
export async function addItem(item: Omit<WikiItem, 'id'>): Promise<WikiItem> {
  // Se Firebase não está configurado, usa localStorage
  if (!isFirebaseConfigured()) {
    console.log('📦 Firebase não configurado, salvando no localStorage');
    return addItemToLocalStorage(item);
  }

  try {
    console.log('💾 Salvando novo item no Firebase...');
    console.log('Dados:', item);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      question: item.question,
      answer: item.answer,
      category: item.category,
      createdAt: new Date(item.createdAt)
    });
    
    console.log('✅ Item salvo com sucesso! ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...item
    };
  } catch (error: any) {
    console.error('❌ Erro ao adicionar item no Firebase:', error);
    console.error('Detalhes:', error.code, error.message);
    
    // Mensagem mais clara para o usuário
    if (error.code === 'permission-denied') {
      console.error('⚠️ Permissão negada. Verifique as regras de segurança do Firestore.');
      alert('Erro: Permissão negada. Verifique as regras de segurança do Firebase Console.');
    } else if (error.code === 'unavailable') {
      console.error('⚠️ Firestore não está disponível. Verifique se o banco foi criado.');
      alert('Erro: Firebase não disponível. Verifique se o Firestore foi criado no console.');
    }
    
    // Fallback para localStorage
    console.log('📦 Salvando no localStorage como fallback');
    return addItemToLocalStorage(item);
  }
}

/**
 * Atualiza um item existente
 */
export async function updateItem(id: string, item: Omit<WikiItem, 'id'>): Promise<void> {
  // Se Firebase não está configurado, usa localStorage
  if (!isFirebaseConfigured()) {
    console.log('📦 Firebase não configurado, atualizando no localStorage');
    updateItemInLocalStorage(id, item);
    return;
  }

  try {
    console.log('✏️ Atualizando item no Firebase, ID:', id);
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      question: item.question,
      answer: item.answer,
      category: item.category,
      createdAt: new Date(item.createdAt)
    });
    console.log('✅ Item atualizado com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro ao atualizar item no Firebase:', error);
    console.error('Detalhes:', error.code, error.message);
    
    if (error.code === 'permission-denied') {
      alert('Erro: Permissão negada. Verifique as regras de segurança do Firebase Console.');
    }
    
    updateItemInLocalStorage(id, item);
  }
}

/**
 * Deleta um item
 */
export async function deleteItem(id: string): Promise<void> {
  // Se Firebase não está configurado, usa localStorage
  if (!isFirebaseConfigured()) {
    console.log('📦 Firebase não configurado, deletando do localStorage');
    deleteItemFromLocalStorage(id);
    return;
  }

  try {
    console.log('🗑️ Deletando item do Firebase, ID:', id);
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('✅ Item deletado com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro ao deletar item no Firebase:', error);
    console.error('Detalhes:', error.code, error.message);
    
    if (error.code === 'permission-denied') {
      alert('Erro: Permissão negada. Verifique as regras de segurança do Firebase Console.');
    }
    
    deleteItemFromLocalStorage(id);
  }
}

/**
 * Testa a conexão com o Firebase
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseConfigured()) {
    return { success: false, message: 'Firebase não configurado' };
  }

  try {
    console.log('🧪 Testando conexão com Firebase...');
    const q = collection(db, COLLECTION_NAME);
    await getDocs(q);
    console.log('✅ Conexão com Firebase funcionando!');
    return { success: true, message: 'Conexão OK' };
  } catch (error: any) {
    console.error('❌ Erro na conexão com Firebase:', error);
    
    let message = 'Erro desconhecido';
    if (error.code === 'permission-denied') {
      message = 'Permissão negada. Verifique as regras de segurança do Firestore.';
    } else if (error.code === 'unavailable') {
      message = 'Firestore não disponível. Verifique se o banco foi criado no console.';
    } else if (error.code === 'not-found') {
      message = 'Coleção não encontrada. O banco pode estar vazio ou não foi criado.';
    } else {
      message = error.message || 'Erro ao conectar com Firebase';
    }
    
    return { success: false, message };
  }
}

/**
 * Importa múltiplos itens (batch)
 */
export async function importItems(items: Omit<WikiItem, 'id'>[], mode: 'replace' | 'append'): Promise<void> {
  // Se Firebase não está configurado, usa localStorage
  if (!isFirebaseConfigured()) {
    importItemsToLocalStorage(items, mode);
    return;
  }

  try {
    if (mode === 'replace') {
      // Deleta todos os itens existentes
      const existingItems = await getAllItems();
      const batch = writeBatch(db);
      existingItems.forEach((item) => {
        const docRef = doc(db, COLLECTION_NAME, item.id);
        batch.delete(docRef);
      });
      await batch.commit();
    }

    // Adiciona novos itens
    const batch = writeBatch(db);
    items.forEach((item) => {
      const docRef = doc(collection(db, COLLECTION_NAME));
      batch.set(docRef, {
        question: item.question,
        answer: item.answer,
        category: item.category,
        createdAt: new Date(item.createdAt)
      });
    });
    await batch.commit();
  } catch (error) {
    console.error('Erro ao importar itens no Firebase:', error);
    importItemsToLocalStorage(items, mode);
  }
}

// ============================================
// FUNÇÕES DE LOCAL STORAGE (FALLBACK)
// ============================================

function getItemsFromLocalStorage(): WikiItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erro ao ler localStorage:', error);
  }
  return initialItems;
}

function saveItemsToLocalStorage(items: WikiItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

function addItemToLocalStorage(item: Omit<WikiItem, 'id'>): WikiItem {
  const items = getItemsFromLocalStorage();
  const newItem: WikiItem = {
    id: `local-${Date.now()}`,
    ...item
  };
  items.unshift(newItem);
  saveItemsToLocalStorage(items);
  return newItem;
}

function updateItemInLocalStorage(id: string, item: Omit<WikiItem, 'id'>): void {
  const items = getItemsFromLocalStorage();
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index] = { id, ...item };
    saveItemsToLocalStorage(items);
  }
}

function deleteItemFromLocalStorage(id: string): void {
  const items = getItemsFromLocalStorage();
  const filtered = items.filter(i => i.id !== id);
  saveItemsToLocalStorage(filtered);
}

function importItemsToLocalStorage(items: Omit<WikiItem, 'id'>[], mode: 'replace' | 'append'): void {
  const newItems: WikiItem[] = items.map((item, index) => ({
    id: `local-import-${Date.now()}-${index}`,
    ...item
  }));

  if (mode === 'replace') {
    saveItemsToLocalStorage(newItems);
  } else {
    const existing = getItemsFromLocalStorage();
    saveItemsToLocalStorage([...newItems, ...existing]);
  }
}

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Verifica se o banco de dados está usando Firebase ou localStorage
 */
export function getDatabaseType(): 'firebase' | 'localStorage' {
  return isFirebaseConfigured() ? 'firebase' : 'localStorage';
}

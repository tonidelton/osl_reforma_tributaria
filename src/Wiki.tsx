import { useState, useEffect } from 'react';

// ============================================
// WIKI - Perguntas e Respostas
// Página pública para clientes
// ============================================

interface WikiItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

const STORAGE_KEY = 'osl-wiki-items';
const ADMIN_PASSWORD = 'osl2026'; // Senha simples para demonstração

// Dados iniciais de exemplo
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

export default function Wiki() {
  const [items, setItems] = useState<WikiItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialItems;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Salvar no localStorage quando items mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // Filtrar itens
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obter categorias únicas
  const categories = ['Todas', ...Array.from(new Set(items.map(item => item.category)))];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-light to-primary-dark text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Central de Ajuda
            </h1>
            <p className="text-lg text-blue-200 mb-8">
              Encontre respostas para suas dúvidas sobre Reforma Tributária, PIX e outros temas contábeis
            </p>

            {/* Busca */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Buscar perguntas e respostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                aria-label="Buscar na wiki"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtros de categoria */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resultados */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-500">
              Tente buscar com outros termos ou entre em contato conosco
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  className="w-full text-left p-6 flex items-start justify-between gap-4"
                  aria-expanded={expandedItem === item.id}
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-primary text-lg mb-2">
                          {item.question}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      expandedItem === item.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedItem === item.id && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <div className="pl-9 border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Link para contato */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Não encontrou o que procurava?
          </p>
          <a
            href="#contato"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Entre em contato conosco
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ADMIN - Área Administrativa da Wiki
// ============================================

export function WikiAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState<WikiItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialItems;
  });

  const [editingItem, setEditingItem] = useState<WikiItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: ''
  });

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  // Salvar item
  const handleSave = () => {
    if (!formData.question.trim() || !formData.answer.trim() || !formData.category.trim()) {
      alert('Preencha todos os campos');
      return;
    }

    if (editingItem) {
      // Editar
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      // Criar novo
      const newItem: WikiItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setItems([newItem, ...items]);
    }

    // Salvar no localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...items]));
    } catch {}

    // Reset form
    setFormData({ question: '', answer: '', category: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  // Editar item
  const handleEdit = (item: WikiItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category
    });
    setShowForm(true);
  };

  // Deletar item
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta pergunta?')) {
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch {}
    }
  };

  // Cancelar edição
  const handleCancel = () => {
    setFormData({ question: '', answer: '', category: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  // Tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2">Área Administrativa</h2>
              <p className="text-gray-600 text-sm">Digite a senha para acessar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite a senha"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Entrar
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-800">
                <strong>Senha de demonstração:</strong> osl2026
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Área administrativa
  return (
    <div className="min-h-screen bg-surface">
      {/* Header Admin */}
      <div className="bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Gerenciar Wiki</h1>
              <p className="text-blue-200 text-sm mt-1">Área administrativa</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão adicionar */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ question: '', answer: '', category: '' });
              setShowForm(true);
            }}
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Pergunta
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-xl font-bold text-primary mb-4">
              {editingItem ? 'Editar Pergunta' : 'Nova Pergunta'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pergunta
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Digite a pergunta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resposta
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Digite a resposta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Reforma Tributária, PIX, etc."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {editingItem ? 'Salvar Alterações' : 'Criar Pergunta'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de perguntas */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhuma pergunta cadastrada
              </h3>
              <p className="text-gray-500">
                Clique em "Nova Pergunta" para começar
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary text-lg mb-2">
                      {item.question}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.answer}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import ImportadorExcel from './ImportadorExcel';
import * as XLSX from 'xlsx';
import { WikiItem, getAllItems, addItem, updateItem, deleteItem, importItems, getDatabaseType } from './db';

// ============================================
// WIKI - Perguntas e Respostas
// Página pública para clientes
// ============================================

export default function Wiki() {
  const [items, setItems] = useState<WikiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Carrega os itens do banco de dados
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getAllItems();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtra itens baseado na busca e categoria
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtém categorias únicas
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
        {/* Indicador de banco de dados */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${getDatabaseType() === 'firebase' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
            {getDatabaseType() === 'firebase' ? 'Banco de dados: Firebase' : 'Modo demonstração (localStorage)'}
          </span>
        </div>

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

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Carregando perguntas...</p>
          </div>
        ) : filteredItems.length === 0 ? (
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

const ADMIN_PASSWORD = 'osl2026'; // Senha simples para demonstração

export function WikiAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState<WikiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<WikiItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showImportador, setShowImportador] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: ''
  });

  // Carrega os itens do banco de dados
  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getAllItems();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Função de importação via Excel
  const handleImportacao = async (novosItens: Array<{ question: string; answer: string; category: string; createdAt: string }>, mode: 'replace' | 'append') => {
    try {
      await importItems(novosItens, mode);
      await loadItems(); // Recarrega os itens
    } catch (error) {
      console.error('Erro ao importar itens:', error);
      alert('Erro ao importar itens. Tente novamente.');
    }
  };

  // Salvar item (criar ou editar)
  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim() || !formData.category.trim()) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      if (editingItem) {
        // Editar
        await updateItem(editingItem.id, {
          question: formData.question,
          answer: formData.answer,
          category: formData.category,
          createdAt: editingItem.createdAt
        });
      } else {
        // Criar novo
        await addItem({
          question: formData.question,
          answer: formData.answer,
          category: formData.category,
          createdAt: new Date().toISOString().split('T')[0]
        });
      }

      await loadItems(); // Recarrega os itens
      setFormData({ question: '', answer: '', category: '' });
      setEditingItem(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item. Tente novamente.');
    }
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
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta pergunta?')) {
      try {
        await deleteItem(id);
        await loadItems(); // Recarrega os itens
      } catch (error) {
        console.error('Erro ao deletar item:', error);
        alert('Erro ao deletar item. Tente novamente.');
      }
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
              <div className="flex items-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${getDatabaseType() === 'firebase' ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                <span className="text-xs text-blue-200">
                  {getDatabaseType() === 'firebase' ? 'Conectado ao Firebase' : 'Modo demonstração (localStorage)'}
                </span>
              </div>
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
        {/* Botões de ação */}
        <div className="mb-6 flex flex-wrap gap-3">
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
          <button
            onClick={() => setShowImportador(true)}
            className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar do Excel
          </button>
          <button
            onClick={() => {
              // Exportar todos os itens para Excel
              const data = items.map(item => ({
                Pergunta: item.question,
                Resposta: item.answer,
                Categoria: item.category,
                'Data de criação': item.createdAt
              }));
              const ws = XLSX.utils.json_to_sheet(data);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Perguntas');
              ws['!cols'] = [{ wch: 50 }, { wch: 80 }, { wch: 25 }, { wch: 15 }];
              XLSX.writeFile(wb, `wiki-osl-${new Date().toISOString().split('T')[0]}.xlsx`);
            }}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-primary font-semibold rounded-xl shadow-md hover:shadow-lg border-2 border-primary transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar para Excel
          </button>
        </div>

        {/* Modal de importação */}
        {showImportador && (
          <ImportadorExcel
            onImport={handleImportacao}
            onClose={() => setShowImportador(false)}
          />
        )}

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
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Carregando perguntas...</p>
          </div>
        ) : items.length === 0 ? (
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
          <div className="space-y-4">
            {items.map((item) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

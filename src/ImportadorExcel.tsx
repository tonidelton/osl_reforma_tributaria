import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

// ============================================
// IMPORTADOR DE EXCEL - Wiki
// Importa perguntas e respostas de planilhas
// ============================================

interface WikiItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

interface ImportadorExcelProps {
  onImport: (items: WikiItem[], mode: 'replace' | 'append') => void;
  onClose: () => void;
}

interface ItemImportado {
  question: string;
  answer: string;
  category: string;
  valido: boolean;
  erro?: string;
}

export default function ImportadorExcel({ onImport, onClose }: ImportadorExcelProps) {
  const [itensImportados, setItensImportados] = useState<ItemImportado[]>([]);
  const [nomeArquivo, setNomeArquivo] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [modoImportacao, setModoImportacao] = useState<'replace' | 'append'>('append');
  const [etapa, setEtapa] = useState<'upload' | 'preview' | 'sucesso'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processar arquivo Excel
  const processarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErro('');
    setNomeArquivo(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Pegar primeira aba
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (jsonData.length === 0) {
          setErro('A planilha está vazia. Verifique se há dados na primeira aba.');
          return;
        }

        // Validar e mapear colunas
        const itens: ItemImportado[] = [];
        let errosEncontrados = 0;

        jsonData.forEach((row: any, index: number) => {
          // Tentar diferentes nomes de colunas (flexibilidade)
          const question = row.pergunta || row.Pergunta || row.question || row.Question || row.PERGUNTA || '';
          const answer = row.resposta || row.Resposta || row.answer || row.Answer || row.RESPOSTA || '';
          const category = row.categoria || row.Categoria || row.category || row.Category || row.CATEGORIA || 'Geral';

          const item: ItemImportado = {
            question: String(question).trim(),
            answer: String(answer).trim(),
            category: String(category).trim() || 'Geral',
            valido: true,
          };

          // Validações
          if (!item.question) {
            item.valido = false;
            item.erro = `Linha ${index + 2}: Pergunta em branco`;
            errosEncontrados++;
          } else if (!item.answer) {
            item.valido = false;
            item.erro = `Linha ${index + 2}: Resposta em branco`;
            errosEncontrados++;
          }

          itens.push(item);
        });

        if (itens.filter(i => i.valido).length === 0) {
          setErro('Nenhum item válido encontrado. Verifique se as colunas estão nomeadas corretamente (Pergunta, Resposta, Categoria).');
          return;
        }

        setItensImportados(itens);
        setEtapa('preview');
      } catch (err) {
        console.error('Erro ao ler arquivo:', err);
        setErro('Erro ao ler o arquivo. Verifique se é um arquivo Excel válido (.xlsx, .xls ou .csv).');
      }
    };

    reader.onerror = () => {
      setErro('Erro ao ler o arquivo. Tente novamente.');
    };

    reader.readAsArrayBuffer(file);
  };

  // Confirmar importação
  const confirmarImportacao = () => {
    const itensValidos = itensImportados.filter(i => i.valido);
    const itensConvertidos: WikiItem[] = itensValidos.map((item, index) => ({
      id: `import-${Date.now()}-${index}`,
      question: item.question,
      answer: item.answer,
      category: item.category,
      createdAt: new Date().toISOString().split('T')[0],
    }));

    onImport(itensConvertidos, modoImportacao);
    setEtapa('sucesso');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  // Download do template
  const baixarTemplate = () => {
    const templateData = [
      {
        Pergunta: 'Como emitir nota fiscal com os campos de IBS e CBS?',
        Resposta: 'Para emitir notas fiscais com os campos de IBS e CBS, você precisa verificar se seu sistema emissor de notas está atualizado.',
        Categoria: 'Reforma Tributária'
      },
      {
        Pergunta: 'O que é o PIX Automático?',
        Resposta: 'O PIX Automático é uma modalidade de pagamento semelhante ao débito automático, ideal para cobranças recorrentes.',
        Categoria: 'PIX'
      },
      {
        Pergunta: 'Preciso pagar imposto novo em 2026?',
        Resposta: 'Não. 2026 é uma fase de teste com alíquotas experimentais. O recolhimento fica dispensado para quem cumpre as obrigações acessórias.',
        Categoria: 'Reforma Tributária'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Perguntas');
    
    // Ajustar largura das colunas
    ws['!cols'] = [
      { wch: 50 }, // Pergunta
      { wch: 80 }, // Resposta
      { wch: 25 }, // Categoria
    ];
    
    XLSX.writeFile(wb, 'template-wiki-osl.xlsx');
  };

  const totalValidos = itensImportados.filter(i => i.valido).length;
  const totalInvalidos = itensImportados.filter(i => !i.valido).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Importar de Planilha Excel
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Importe perguntas e respostas em massa a partir de uma planilha
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* ETAPA 1: UPLOAD */}
          {etapa === 'upload' && (
            <div className="space-y-6">
              {/* Instruções */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span>📋</span> Estrutura da planilha
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Sua planilha deve ter as seguintes colunas na primeira aba:
                </p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-primary mb-1">Coluna A</p>
                    <p className="text-sm font-bold text-primary">Pergunta</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-primary mb-1">Coluna B</p>
                    <p className="text-sm font-bold text-primary">Resposta</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-primary mb-1">Coluna C</p>
                    <p className="text-sm font-bold text-primary">Categoria</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700">
                  💡 <strong>Dica:</strong> A planilha aceita diferentes nomes para as colunas (pergunta/Pergunta/PERGUNTA/question, etc.)
                </p>
              </div>

              {/* Link da planilha de referência */}
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-5">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <span>🔗</span> Planilha de referência
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Use esta planilha como modelo ou referência para formatar seus dados:
                </p>
                <a
                  href="https://docs.google.com/spreadsheets/d/10hMhLJaXE30utQZDiPlcLSqwsV0I2fZCeCKAUrOrr-E/edit?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir planilha no Google Drive
                </a>
              </div>

              {/* Botão download template */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={baixarTemplate}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-surface-alt hover:bg-gray-200 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Baixar template de exemplo
                </button>
              </div>

              {/* Área de upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const input = fileInputRef.current;
                    if (input) {
                      const dt = new DataTransfer();
                      dt.items.add(file);
                      input.files = dt.files;
                      input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                  }
                }}
                className="border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-8 text-center cursor-pointer transition-colors bg-surface-alt hover:bg-primary/5"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={processarArquivo}
                  className="hidden"
                />
                <div className="text-5xl mb-3">📁</div>
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  Clique ou arraste sua planilha aqui
                </p>
                <p className="text-sm text-gray-500">
                  Formatos aceitos: .xlsx, .xls, .csv
                </p>
              </div>

              {/* Erro */}
              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-900">Erro na importação</p>
                    <p className="text-sm text-red-700">{erro}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ETAPA 2: PREVIEW */}
          {etapa === 'preview' && (
            <div className="space-y-6">
              {/* Resumo */}
              <div className="bg-surface-alt rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Arquivo:</p>
                    <p className="font-semibold text-primary">{nomeArquivo}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEtapa('upload');
                      setItensImportados([]);
                      setNomeArquivo('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    Trocar arquivo
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Total</p>
                    <p className="text-2xl font-bold text-primary">{itensImportados.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                    <p className="text-xs text-gray-500 mb-1">Válidos</p>
                    <p className="text-2xl font-bold text-green-600">{totalValidos}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                    <p className="text-xs text-gray-500 mb-1">Com erro</p>
                    <p className="text-2xl font-bold text-red-600">{totalInvalidos}</p>
                  </div>
                </div>
              </div>

              {/* Modo de importação */}
              <div>
                <h3 className="font-semibold text-primary mb-3">Modo de importação</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setModoImportacao('append')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      modoImportacao === 'append'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold text-primary mb-1">➕ Adicionar</p>
                    <p className="text-xs text-gray-600">
                      Adiciona às perguntas existentes
                    </p>
                  </button>
                  <button
                    onClick={() => setModoImportacao('replace')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      modoImportacao === 'replace'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold text-primary mb-1">🔄 Substituir</p>
                    <p className="text-xs text-gray-600">
                      Remove todas e importa apenas as novas
                    </p>
                  </button>
                </div>
              </div>

              {/* Preview dos itens */}
              <div>
                <h3 className="font-semibold text-primary mb-3">
                  Preview ({totalValidos} perguntas válidas)
                </h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-alt sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">#</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Pergunta</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Categoria</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {itensImportados.map((item, index) => (
                        <tr key={index} className={item.valido ? 'hover:bg-gray-50' : 'bg-red-50'}>
                          <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                          <td className="px-3 py-2">
                            <p className="font-medium text-gray-900 line-clamp-1">{item.question}</p>
                            {item.erro && <p className="text-xs text-red-600 mt-1">{item.erro}</p>}
                          </td>
                          <td className="px-3 py-2">
                            <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {item.valido ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                OK
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Erro
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Aviso de substituição */}
              {modoImportacao === 'replace' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Atenção</p>
                    <p className="text-sm text-amber-800">
                      Ao escolher "Substituir", todas as perguntas existentes serão removidas e apenas as da planilha serão mantidas.
                    </p>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarImportacao}
                  disabled={totalValidos === 0}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Importar {totalValidos} pergunta{totalValidos !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3: SUCESSO */}
          {etapa === 'sucesso' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-primary mb-2">Importação concluída!</h3>
              <p className="text-gray-600">
                {totalValidos} pergunta{totalValidos !== 1 ? 's' : ''} importada{totalValidos !== 1 ? 's' : ''} com sucesso.
              </p>
              <p className="text-sm text-gray-500 mt-2">Fechando automaticamente...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

// ============================================
// CALCULADORA — Formação de Preço de Vendas
// Converte preço com PIS/COFINS "por dentro"
// para preço com CBS "por fora"
// ============================================

type RegimeTributario = 'presumido' | 'real';

interface Configuracao {
  regime: RegimeTributario;
  cbs: number; // percentual da CBS
}

interface DadosEntrada {
  precoAtual: number; // preço final atual (com PIS/COFINS por dentro)
  custoProduto: number; // custo do produto
  outrasDespesas: number; // outras despesas operacionais
  margemDesejada: number; // margem de lucro desejada (%)
}

const STORAGE_KEY = 'osl-calculadora-config';

// Alíquotas fixas por regime
const ALIQUOTAS = {
  presumido: { pis: 0.65, cofins: 3.00 }, // total 3,65%
  real: { pis: 1.65, cofins: 7.60 }, // total 9,25%
};

export default function Calculadora() {
  // Configuração persistente
  const [config, setConfig] = useState<Configuracao>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { regime: 'presumido', cbs: 8.80 };
  });

  // Dados de entrada
  const [dados, setDados] = useState<DadosEntrada>({
    precoAtual: 100,
    custoProduto: 50,
    outrasDespesas: 10,
    margemDesejada: 20,
  });

  // Persistir configuração
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  // ============================================
  // CÁLCULOS
  // ============================================

  // Alíquota total de PIS+COFINS do regime selecionado
  const aliquotaAtual = config.regime === 'presumido'
    ? ALIQUOTAS.presumido.pis + ALIQUOTAS.presumido.cofins // 3,65%
    : ALIQUOTAS.real.pis + ALIQUOTAS.real.cofins; // 9,25%

  // Preço líquido (sem PIS/COFINS)
  // Fórmula: Preço líquido = Preço atual / (1 + alíquota/100)
  // No modelo "por dentro", o tributo está embutido no preço
  // Para extrair: Líquido = Final / (1 + aliquotaAtual/100)
  // Nota: na prática "por dentro" significa que o tributo é calculado sobre o preço final
  // então: Final = Líquido + (Final × alíquota) → Líquido = Final × (1 - alíquota)
  // Mas a forma mais comum no Brasil é: Final = Líquido / (1 - alíquota)
  // Vamos usar a convenção: o tributo "por dentro" é calculado sobre o preço final
  // então: Preço atual = Preço líquido + (Preço atual × alíquota/100)
  // Preço líquido = Preço atual × (1 - alíquota/100)
  const precoLiquido = dados.precoAtual * (1 - aliquotaAtual / 100);

  // Tributo atual (PIS+COFINS) embutido no preço
  const tributoAtual = dados.precoAtual - precoLiquido;

  // Novo preço com CBS "por fora"
  // Fórmula: Novo preço = Preço líquido × (1 + CBS/100)
  const cbsValor = precoLiquido * (config.cbs / 100);
  const precoNovo = precoLiquido + cbsValor;

  // Diferença
  const diferenca = precoNovo - dados.precoAtual;
  const variacaoPercentual = dados.precoAtual > 0 ? (diferenca / dados.precoAtual) * 100 : 0;

  // Margem atual (sobre o preço atual)
  const lucroAtual = dados.precoAtual - dados.custoProduto - dados.outrasDespesas - tributoAtual;
  const margemAtual = dados.precoAtual > 0 ? (lucroAtual / dados.precoAtual) * 100 : 0;

  // Margem no novo modelo (sobre o preço novo)
  const lucroNovo = precoNovo - dados.custoProduto - dados.outrasDespesas - cbsValor;
  const margemNova = precoNovo > 0 ? (lucroNovo / precoNovo) * 100 : 0;

  // Preço para atingir a margem desejada no novo modelo
  // Margem = (Preço - Custos - Tributo) / Preço
  // Margem × Preço = Preço - Custos - (Preço × CBS/100)
  // Preço × (1 - Margem - CBS/100) = Custos
  const custosTotais = dados.custoProduto + dados.outrasDespesas;
  const precoParaMargem = custosTotais / (1 - (dados.margemDesejada / 100) - (config.cbs / 100));
  const cbsParaMargem = precoParaMargem * (config.cbs / 100);

  // Formato de moeda
  const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtPct = (v: number) => `${v.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-light to-primary-dark text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="text-xl">🧮</span>
              <span className="text-white/90 text-sm font-medium">Ferramenta prática</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Calculadora de Formação de Preço
            </h1>
            <p className="text-lg text-blue-200 leading-relaxed">
              Converta seu preço atual (com PIS/COFINS "por dentro") para o novo modelo 
              com CBS "por fora" e veja o impacto real na sua margem.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Configuração do regime */}
        <div className="reveal max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="text-2xl">⚙️</span> Configuração
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Regime tributário */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Regime Tributário
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfig({ ...config, regime: 'presumido' })}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      config.regime === 'presumido'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <p className="font-bold text-primary mb-1">Lucro Presumido</p>
                    <p className="text-xs text-gray-600">PIS: {ALIQUOTAS.presumido.pis}%</p>
                    <p className="text-xs text-gray-600">COFINS: {ALIQUOTAS.presumido.cofins}%</p>
                    <p className="text-xs font-semibold text-primary mt-1">Total: {ALIQUOTAS.presumido.pis + ALIQUOTAS.presumido.cofins}%</p>
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, regime: 'real' })}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      config.regime === 'real'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <p className="font-bold text-primary mb-1">Lucro Real</p>
                    <p className="text-xs text-gray-600">PIS: {ALIQUOTAS.real.pis}%</p>
                    <p className="text-xs text-gray-600">COFINS: {ALIQUOTAS.real.cofins}%</p>
                    <p className="text-xs font-semibold text-primary mt-1">Total: {ALIQUOTAS.real.pis + ALIQUOTAS.real.cofins}%</p>
                  </button>
                </div>
              </div>

              {/* CBS configurável */}
              <div>
                <label htmlFor="cbs" className="block text-sm font-semibold text-gray-700 mb-3">
                  Alíquota da CBS (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="cbs"
                    step="0.01"
                    min="0"
                    max="100"
                    value={config.cbs}
                    onChange={(e) => setConfig({ ...config, cbs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg font-semibold text-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Alíquota atual em teste: 8,80%. Este valor pode variar conforme regulamentação.
                </p>
              </div>
            </div>

            {/* Resumo da configuração */}
            <div className="mt-6 p-4 bg-surface-alt rounded-xl border border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Regime</p>
                  <p className="font-bold text-primary text-sm">
                    {config.regime === 'presumido' ? 'Lucro Presumido' : 'Lucro Real'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">PIS + COFINS atual</p>
                  <p className="font-bold text-red-600 text-sm">{fmtPct(aliquotaAtual)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">CBS nova</p>
                  <p className="font-bold text-accent-dark text-sm">{fmtPct(config.cbs)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Modelo</p>
                  <p className="font-bold text-primary text-sm">Por fora (CBS)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dados de entrada */}
        <div className="reveal max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="text-2xl">💰</span> Dados do Produto
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="precoAtual" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço atual de venda
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                  <input
                    type="number"
                    id="precoAtual"
                    step="0.01"
                    min="0"
                    value={dados.precoAtual}
                    onChange={(e) => setDados({ ...dados, precoAtual: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Com PIS/COFINS embutidos</p>
              </div>

              <div>
                <label htmlFor="custoProduto" className="block text-sm font-medium text-gray-700 mb-2">
                  Custo do produto
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                  <input
                    type="number"
                    id="custoProduto"
                    step="0.01"
                    min="0"
                    value={dados.custoProduto}
                    onChange={(e) => setDados({ ...dados, custoProduto: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="outrasDespesas" className="block text-sm font-medium text-gray-700 mb-2">
                  Outras despesas
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                  <input
                    type="number"
                    id="outrasDespesas"
                    step="0.01"
                    min="0"
                    value={dados.outrasDespesas}
                    onChange={(e) => setDados({ ...dados, outrasDespesas: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="margemDesejada" className="block text-sm font-medium text-gray-700 mb-2">
                  Margem desejada
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="margemDesejada"
                    step="0.1"
                    min="0"
                    max="100"
                    value={dados.margemDesejada}
                    onChange={(e) => setDados({ ...dados, margemDesejada: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-3 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="reveal max-w-5xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Comparativo: Modelo Atual × Novo Modelo
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Modelo atual */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-red-100 overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h3 className="font-bold text-red-900">Modelo Atual</h3>
                    <p className="text-xs text-red-700">PIS/COFINS "por dentro"</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <ResultRow label="Preço final de venda" value={fmtBRL(dados.precoAtual)} bold />
                <ResultRow label="Preço líquido (s/ tributos)" value={fmtBRL(precoLiquido)} />
                <ResultRow label={`PIS + COFINS (${fmtPct(aliquotaAtual)})`} value={fmtBRL(tributoAtual)} negative />
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <ResultRow label="Custo do produto" value={fmtBRL(dados.custoProduto)} />
                  <ResultRow label="Outras despesas" value={fmtBRL(dados.outrasDespesas)} />
                  <ResultRow label="Lucro líquido" value={fmtBRL(lucroAtual)} bold positive={lucroAtual > 0} negative={lucroAtual < 0} />
                  <ResultRow label="Margem sobre venda" value={fmtPct(margemAtual)} bold positive={margemAtual > 0} negative={margemAtual < 0} />
                </div>
              </div>
            </div>

            {/* Novo modelo */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-green-200 overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h3 className="font-bold text-green-900">Novo Modelo</h3>
                    <p className="text-xs text-green-700">CBS "por fora"</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <ResultRow label="Preço líquido" value={fmtBRL(precoLiquido)} />
                <ResultRow label={`CBS (${fmtPct(config.cbs)}) — destacado`} value={fmtBRL(cbsValor)} />
                <ResultRow label="Preço final de venda" value={fmtBRL(precoNovo)} bold />
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <ResultRow label="Custo do produto" value={fmtBRL(dados.custoProduto)} />
                  <ResultRow label="Outras despesas" value={fmtBRL(dados.outrasDespesas)} />
                  <ResultRow label="Lucro líquido" value={fmtBRL(lucroNovo)} bold positive={lucroNovo > 0} negative={lucroNovo < 0} />
                  <ResultRow label="Margem sobre venda" value={fmtPct(margemNova)} bold positive={margemNova > 0} negative={margemNova < 0} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impacto */}
        <div className="reveal max-w-5xl mx-auto mb-8">
          <div className={`rounded-2xl p-6 sm:p-8 border-2 ${
            diferenca > 0 ? 'bg-amber-50 border-amber-200' :
            diferenca < 0 ? 'bg-green-50 border-green-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="text-2xl">{diferenca > 0 ? '⚠️' : diferenca < 0 ? '✅' : '➖'}</span>
              Impacto no preço final
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Diferença no preço</p>
                <p className={`text-2xl font-bold ${diferenca > 0 ? 'text-amber-600' : diferenca < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  {diferenca > 0 ? '+' : ''}{fmtBRL(diferenca)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Variação percentual</p>
                <p className={`text-2xl font-bold ${variacaoPercentual > 0 ? 'text-amber-600' : variacaoPercentual < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  {variacaoPercentual > 0 ? '+' : ''}{fmtPct(variacaoPercentual)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Diferença de margem</p>
                <p className={`text-2xl font-bold ${(margemNova - margemAtual) > 0 ? 'text-green-600' : (margemNova - margemAtual) < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {(margemNova - margemAtual) > 0 ? '+' : ''}{fmtPct(margemNova - margemAtual)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preço para atingir margem desejada */}
        <div className="reveal max-w-5xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Preço para atingir margem desejada
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para manter sua margem de <strong>{fmtPct(dados.margemDesejada)}</strong> no novo modelo com CBS de <strong>{fmtPct(config.cbs)}</strong>, 
              o preço de venda deve ser:
            </p>
            <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Preço líquido</p>
                  <p className="text-lg font-bold text-primary">{fmtBRL(precoParaMargem - cbsParaMargem)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">CBS ({fmtPct(config.cbs)})</p>
                  <p className="text-lg font-bold text-accent-dark">{fmtBRL(cbsParaMargem)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Preço final</p>
                  <p className="text-2xl font-extrabold text-primary">{fmtBRL(precoParaMargem)}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              💡 <strong>Dica:</strong> no novo modelo, o CBS aparece em linha separada na nota fiscal. 
              Seu cliente vê claramente quanto é produto e quanto é imposto.
            </p>
          </div>
        </div>

        {/* Explicação didática */}
        <div className="reveal max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span> Entenda o cálculo
            </h3>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <h4 className="font-semibold text-red-900 mb-2">Modelo atual (tributo "por dentro")</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  O tributo é calculado sobre o <strong>preço final</strong>. Ele está "escondido" dentro do preço.
                </p>
                <div className="bg-white rounded-lg p-3 font-mono text-xs">
                  <p>Preço líquido = Preço final × (1 - alíquota)</p>
                  <p className="mt-1">= {fmtBRL(dados.precoAtual)} × (1 - {aliquotaAtual/100})</p>
                  <p>= <strong>{fmtBRL(precoLiquido)}</strong></p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h4 className="font-semibold text-green-900 mb-2">Novo modelo (tributo "por fora")</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  O tributo é calculado sobre o <strong>preço líquido</strong> e aparece em linha separada na nota.
                </p>
                <div className="bg-white rounded-lg p-3 font-mono text-xs">
                  <p>CBS = Preço líquido × (alíquota CBS)</p>
                  <p className="mt-1">= {fmtBRL(precoLiquido)} × ({config.cbs/100})</p>
                  <p>= <strong>{fmtBRL(cbsValor)}</strong></p>
                  <p className="mt-2">Preço final = Líquido + CBS</p>
                  <p>= {fmtBRL(precoLiquido)} + {fmtBRL(cbsValor)}</p>
                  <p>= <strong>{fmtBRL(precoNovo)}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aviso */}
        <div className="reveal max-w-5xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Atenção</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Esta calculadora é uma ferramenta de simulação e não substitui análise contábil personalizada. 
                A alíquota da CBS pode variar conforme regulamentação. Consulte a equipe da OSL Contadores Associados 
                para um planejamento tributário completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para linha de resultado
function ResultRow({ label, value, bold, positive, negative }: {
  label: string; value: string; bold?: boolean; positive?: boolean; negative?: boolean;
}) {
  const colorClass = positive ? 'text-green-600' : negative ? 'text-red-600' : 'text-gray-700';
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${bold ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{label}</span>
      <span className={`text-sm ${bold ? 'font-bold' : 'font-medium'} ${bold ? colorClass : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// COMPONENTE PRINCIPAL - Guia do Empresário
// OSL Contadores Associados
// ============================================

export default function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  // Scroll spy - detecta seção ativa
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 120;

      sections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        const id = el.getAttribute('id') || '';

        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Toast
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => (prev ? { ...prev, visible: false } : null)), 2500);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Navegação
  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'reforma', label: 'Reforma Tributária' },
    { id: 'cronograma', label: 'Cronograma' },
    { id: 'pix', label: 'Mudanças no PIX' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'faq', label: 'Perguntas Frequentes' },
    { id: 'contato', label: 'Contato' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-gray-800">
      {/* NAVEGAÇÃO FIXA */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OSL</span>
              </div>
              <span className="hidden sm:block text-sm font-semibold text-primary">Guia do Empresário</span>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Menu Mobile Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 ${toast.visible ? 'toast-enter' : 'toast-exit'}`}>
          <div className="bg-primary text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* HERO / INÍCIO */}
      <section id="inicio" className="pt-24 pb-16 sm:pt-32 sm:pb-24 bg-gradient-to-br from-primary via-primary-light to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">Conteúdo atualizado — Setembro 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Guia do Empresário
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 font-medium mb-4">
              Reforma Tributária e PIX
            </p>
            <p className="text-base sm:text-lg text-blue-200 max-w-2xl mx-auto mb-8 leading-relaxed">
              Tudo o que você precisa saber sobre as mudanças tributárias e as novas regras do PIX, 
              explicado de forma simples para o dia a dia da sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollTo('reforma')}
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Entender a Reforma Tributária
              </button>
              <button
                onClick={() => scrollTo('pix')}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
              >
                Mudanças no PIX
              </button>
            </div>
          </div>

          {/* Selo OSL */}
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">OSL Contadores Associados</p>
                <p className="text-blue-200 text-xs">Conteúdo preparado pela equipe contábil</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1 — REFORMA TRIBUTÁRIA */}
      <ReformaTributaria />

      {/* SEÇÃO 2 — CRONOGRAMA */}
      <Cronograma />

      {/* SEÇÃO 3 — MUDANÇAS NO PIX */}
      <MudancasPix />

      {/* SEÇÃO 4 — CHECKLIST */}
      <Checklist showToast={showToast} />

      {/* SEÇÃO 5 — FAQ */}
      <FAQ />

      {/* SEÇÃO 6 — RODAPÉ / CONTATO */}
      <Footer showToast={showToast} />
    </div>
  );
}

// ============================================
// SEÇÃO 1 — REFORMA TRIBUTÁRIA
// ============================================
function ReformaTributaria() {
  return (
    <section id="reforma" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="reveal text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Seção 1
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Reforma Tributária: o que é e o que muda
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Entenda de forma simples como a reforma está transformando os impostos sobre consumo no Brasil 
            e o que isso significa para a sua empresa.
          </p>
        </div>

        {/* Card principal - O que é */}
        <div className="reveal max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 sm:p-10 border border-primary/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">O que está mudando?</h3>
                <p className="text-gray-700 leading-relaxed">
                  A Reforma Tributária substitui cinco tributos sobre o consumo por dois novos: a <strong>CBS</strong> 
                  (Contribuição sobre Bens e Serviços, de competência federal) e o <strong>IBS</strong> 
                  (Imposto sobre Bens e Serviços, de competência dos estados e municípios). 
                  Esse modelo é chamado de <strong>IVA Dual</strong> — ou seja, dois impostos no formato IVA 
                  (Imposto sobre Valor Agregado, que é um imposto cobrado em cada etapa da produção, 
                  mas que no final incide apenas sobre o consumidor).
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <span className="text-lg">🏛️</span> CBS
                </h4>
                <p className="text-sm text-gray-600">
                  Contribuição sobre Bens e Serviços — tributo federal que substitui PIS, Cofins e IPI.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <span className="text-lg">🏢</span> IBS
                </h4>
                <p className="text-sm text-gray-600">
                  Imposto sobre Bens e Serviços — tributo de estados e municípios que substitui ICMS e ISS.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/70 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-600">
                <strong>Tributos extintos:</strong> PIS, Cofins, IPI, ICMS e ISS — todos substituídos pela CBS e pelo IBS.
              </p>
            </div>
          </div>
        </div>

        {/* Cards informativos */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <InfoCard
            icon="🧪"
            title="Fase de teste em 2026"
            description="Desde 1º de janeiro de 2026, vigora uma alíquota de teste: 0,9% de CBS e 0,1% de IBS (total 1%), em caráter experimental. O recolhimento fica dispensado para quem cumpre as obrigações acessórias (Lei Complementar 214/2025, art. 348, § 1º). Na prática, 2026 é o ano de adaptação de sistemas e notas fiscais, sem pagamento efetivo dos novos tributos."
          />
          <InfoCard
            icon="📋"
            title="Campos obrigatórios desde 03/08/2026"
            description="A partir de 03/08/2026, não é mais permitida a emissão de documentos fiscais eletrônicos sem o preenchimento dos campos de IBS e CBS para empresas do regime regular. Essa é uma regra do Comitê Gestor do IBS — o órgão que coordena a implementação do novo imposto nos estados e municípios."
          />
          <InfoCard
            icon="📊"
            title="Simples Nacional em 2027"
            description="Para empresas optantes pelo Simples Nacional, a discriminação das alíquotas de IBS e CBS nos documentos fiscais começa somente em 2027, conforme cronograma divulgado pela Receita Federal e pelo Comitê Gestor do IBS."
          />
          <InfoCard
            icon="💰"
            title="Cobertura efetiva a partir de 2027"
            description="A partir de 2027 inicia a cobrança efetiva da CBS. O IPI passa a ter alíquota zero, salvo exceções ligadas à Zona Franca de Manaus (área de livre comércio com benefícios fiscais especiais)."
          />
          <InfoCard
            icon="📅"
            title="Transição gradual do IBS (2029-2032)"
            description="O IBS entra em vigor de forma gradual entre 2029 e 2032. A extinção total do ICMS e do ISS ocorre em 2033, quando o novo modelo estará plenamente vigente."
          />
          <InfoCard
            icon="🛒"
            title="Cesta básica e Imposto Seletivo"
            description="A cesta básica nacional terá alíquota zero. Setores específicos terão reduções de 60% e 30%. O Imposto Seletivo (IS) incide sobre bens e serviços prejudiciais à saúde ou ao meio ambiente — como cigarros e bebidas alcoólicas — funcionando como um 'imposto do pecado' para desestimular o consumo desses produtos."
          />
        </div>
      </div>
    </section>
  );
}

// Card informativo reutilizável
function InfoCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="reveal bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div>
          <h4 className="font-bold text-primary mb-2">{title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SEÇÃO 2 — CRONOGRAMA
// ============================================
function Cronograma() {
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  const timelineItems = [
    {
      year: '2026',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      title: 'Fase de Teste',
      summary: 'Alíquotas experimentais e adaptação de sistemas',
      details: [
        'CBS: alíquota de teste de 0,9%',
        'IBS: alíquota de teste de 0,1%',
        'Total: 1% em caráter experimental',
        'Recolhimento dispensado para quem cumpre obrigações acessórias (LC 214/2025, art. 348, § 1º)',
        'Desde 03/08/2026: campos de IBS e CBS obrigatórios nas notas fiscais (regime regular)',
        'Simples Nacional dispensado da discriminação em 2026',
      ],
      impact: 'Este é o ano de preparar seu sistema emissor de notas fiscais. Converse com seu contador para garantir que tudo esteja adequado. Você não vai pagar imposto novo, mas precisa emitir notas com os novos campos a partir de agosto.',
    },
    {
      year: '2027',
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      title: 'Início da Cobrança',
      summary: 'CBS começa a ser cobrada; Simples discrimina IBS/CBS',
      details: [
        'Início efetivo da cobrança da CBS',
        'IPI com alíquota zero (salvo Zona Franca de Manaus)',
        'Simples Nacional passa a discriminar IBS e CBS nos documentos fiscais',
      ],
      impact: 'Agora a CBS passa a ser cobrada de fato. Se você é do Simples Nacional, suas notas fiscais passam a mostrar separadamente os valores de IBS e CBS. Converse com seu contador para entender o impacto nos seus preços.',
    },
    {
      year: '2029–2032',
      color: 'bg-amber-500',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-50',
      title: 'Transição Gradual do IBS',
      summary: 'IBS entra em vigor de forma progressiva',
      details: [
        'Transição gradual do IBS ao longo de 4 anos',
        'Redução progressiva do ICMS e ISS',
        'Aumento proporcional do IBS a cada ano',
      ],
      impact: 'Durante esses anos, você vai conviver com o modelo antigo e o novo ao mesmo tempo. O ICMS e o ISS vão diminuindo aos poucos enquanto o IBS vai aumentando. Seu contador vai acompanhando essa transição com você.',
    },
    {
      year: '2033',
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50',
      title: 'Modelo Pleno',
      summary: 'ICMS e ISS extintos; CBS e IBS plenamente vigentes',
      details: [
        'Extinção total de ICMS e ISS',
        'Novo modelo tributário plenamente vigente',
        'CBS + IBS operando integralmente',
      ],
      impact: 'A partir de 2033, o novo sistema tributário estará 100% em vigor. Não haverá mais ICMS nem ISS. Todo o sistema estará adaptado à CBS e ao IBS. Até lá, seu contador terá acompanhado cada etapa com você.',
    },
  ];

  return (
    <section id="cronograma" className="py-16 sm:py-24 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="reveal text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Seção 2
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Cronograma da Reforma
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Veja ano a ano o que acontece e o que muda para a sua empresa. 
            Clique em cada período para ver os detalhes.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {timelineItems.map((item, index) => (
              <div key={item.year} className="reveal relative pl-16 sm:pl-20 pb-10 last:pb-0">
                {/* Ponto na linha */}
                <div className={`absolute left-4 sm:left-6 w-4 h-4 ${item.color} rounded-full border-4 border-white shadow-md top-1`}></div>

                {/* Card */}
                <button
                  onClick={() => setExpandedYear(expandedYear === item.year ? null : item.year)}
                  className={`w-full text-left bg-white rounded-2xl shadow-sm border ${item.borderColor} border-l-4 hover:shadow-md transition-all duration-300 overflow-hidden`}
                  aria-expanded={expandedYear === item.year}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`inline-block px-3 py-1 ${item.bgColor} rounded-lg text-sm font-bold mb-2`}>
                          {item.year}
                        </span>
                        <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.summary}</p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                          expandedYear === item.year ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Conteúdo expansível */}
                  {expandedYear === item.year && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-gray-100 pt-4 animate-fade-in">
                      <ul className="space-y-2 mb-4">
                        {item.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {detail}
                          </li>
                        ))}
                      </ul>
                      <div className={`${item.bgColor} rounded-xl p-4 border border-gray-100`}>
                        <p className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
                          <span>💡</span> O que isso significa para você:
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.impact}</p>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SEÇÃO 3 — MUDANÇAS NO PIX
// ============================================
function MudancasPix() {
  return (
    <section id="pix" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="reveal text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Seção 3
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Mudanças no PIX
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            O PIX continua evoluindo. Conheça as novas modalidades e regras de segurança 
            que afetam diretamente o dia a dia da sua empresa.
          </p>
        </div>

        {/* Cards principais */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          <PixCard
            icon="🔄"
            title="PIX Automático"
            highlight="Menos inadimplência, cobrança previsível"
            description="Modalidade semelhante ao débito automático, ideal para cobranças recorrentes como mensalidades e assinaturas. É obrigatória para empresas que fazem cobrança recorrente."
            benefit="Para o pequeno empresário, isso significa menos inadimplência e previsibilidade no recebimento. Seus clientes pagam automaticamente na data combinada, sem necessidade de cobrar manualmente."
          />
          <PixCard
            icon="🔒"
            title="Novas Regras de Segurança"
            highlight="Resolução BCB nº 587 — 18/09/2026"
            description="Reforço dos mecanismos de combate a fraudes, incluindo o MED 2.0 (Mecanismo Especial de Devolução aprimorado), que permite o bloqueio de valores em caso de suspeita de fraude."
            benefit="Na prática: se alguém fizer um PIX suspeito, o banco pode bloquear o valor e devolver. Isso protege tanto quem paga quanto quem recebe."
          />
          <PixCard
            icon="💼"
            title="PIX Automático em Contas-Salário"
            highlight="A partir de 1º de julho de 2027"
            description="Contas-salário poderão usar o PIX Automático para pagamentos recorrentes, sendo essa a única forma de envio permitida nesse tipo de conta a partir dessa data."
            benefit="Se você tem funcionários com conta-salário, eles poderão autorizar débitos automáticos via PIX para pagar contas recorrentes."
          />
          <PixCard
            icon="📄"
            title="Cobrança Híbrida"
            highlight="Boleto + PIX em uma só cobrança"
            description="Combina boleto bancário e PIX em uma mesma cobrança. O cliente pode escolher como pagar, e o sistema identifica automaticamente qual modalidade foi utilizada."
            benefit="Mais facilidade para receber: você emite uma cobrança só e o cliente decide se paga por boleto ou PIX."
          />
          <PixCard
            icon="🧮"
            title="Split Tributário"
            highlight="Conexão direta com a Reforma Tributária"
            description="Iniciativa em evolução no PIX para identificar e separar automaticamente os valores de IBS e CBS no momento da transação. É a tecnologia do PIX se conectando com a reforma tributária."
            benefit="No futuro, quando você receber um PIX, o sistema já vai separar automaticamente a parte do imposto. Isso simplifica muito a gestão tributária da sua empresa."
          />
        </div>

        {/* Dicas de Segurança */}
        <div className="reveal max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl p-6 sm:p-8 border border-primary/10">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              Dicas de Segurança para sua Empresa
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <SecurityTip
                text="Desconfie de pedidos de pagamento recebidos por mensagem (WhatsApp, SMS, e-mail). Sempre confirme por outro canal."
              />
              <SecurityTip
                text="Conferir os dados do destinatário antes de confirmar qualquer PIX. Verifique nome, CPF/CNPJ e valor."
              />
              <SecurityTip
                text="Mantenha o limite de transação do PIX adequado ao movimento real do CNPJ. Ajuste conforme necessário."
              />
              <SecurityTip
                text="Oriente sua equipe sobre as novas regras de segurança. Todos devem saber identificar tentativas de fraude."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PixCard({ icon, title, highlight, description, benefit }: {
  icon: string; title: string; highlight: string; description: string; benefit: string;
}) {
  return (
    <div className="reveal bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h4 className="font-bold text-primary text-lg">{title}</h4>
          <span className="inline-block px-2 py-0.5 bg-accent/10 text-accent-dark text-xs font-semibold rounded-full mt-1">
            {highlight}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{description}</p>
      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
        <p className="text-sm text-green-800 leading-relaxed">
          <strong>✅ Para você:</strong> {benefit}
        </p>
      </div>
    </div>
  );
}

function SecurityTip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
      <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

// ============================================
// SEÇÃO 4 — CHECKLIST
// ============================================
function Checklist({ showToast }: { showToast: (msg: string) => void }) {
  const STORAGE_KEY = 'osl-checklist-progress';

  const [items, setItems] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [false, false, false, false, false, false];
  });

  const checklistItems = [
    'Verificar se o sistema emissor de notas fiscais já emite documentos com os campos de IBS e CBS.',
    'Conferir com o contador o enquadramento (regime regular ou Simples Nacional) e o cronograma aplicável.',
    'Revisar o cadastro de produtos e serviços para o novo modelo tributário.',
    'Avaliar a adoção do PIX Automático para cobranças recorrentes.',
    'Treinar a equipe sobre as novas regras de segurança do PIX.',
    'Agendar uma reunião com a equipe da OSL para planejamento tributário.',
  ];

  const toggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index] = !newItems[index];
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {}
    if (newItems[index]) {
      showToast('Progresso salvo! ✓');
    }
  };

  const completedCount = items.filter(Boolean).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <section id="checklist" className="py-16 sm:py-24 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="reveal text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Seção 4
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            O que o pequeno empresário deve fazer agora
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Use este checklist para se organizar. Marque cada item conforme for completando. 
            Seu progresso é salvo automaticamente.
          </p>
        </div>

        {/* Barra de Progresso */}
        <div className="reveal max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Seu progresso</span>
              <span className="text-sm font-bold text-primary">{completedCount}/{items.length} itens</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progresso: ${Math.round(progress)}%`}
              ></div>
            </div>
            {progress === 100 && (
              <p className="text-sm text-accent-dark font-semibold mt-3 flex items-center gap-2">
                <span>🎉</span> Parabéns! Você completou todos os itens do checklist.
              </p>
            )}
          </div>
        </div>

        {/* Itens do Checklist */}
        <div className="max-w-3xl mx-auto space-y-3">
          {checklistItems.map((item, index) => (
            <div
              key={index}
              className={`reveal bg-white rounded-xl p-4 sm:p-5 shadow-sm border transition-all duration-300 cursor-pointer hover:shadow-md ${
                items[index] ? 'border-accent/30 bg-accent/5' : 'border-gray-100'
              }`}
              onClick={() => toggleItem(index)}
              role="checkbox"
              aria-checked={items[index]}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleItem(index); } }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                  items[index] ? 'bg-accent border-accent' : 'border-gray-300 hover:border-primary'
                }`}>
                  {items[index] && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm sm:text-base leading-relaxed transition-all duration-200 ${
                  items[index] ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}>
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SEÇÃO 5 — FAQ
// ============================================
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Preciso pagar imposto novo em 2026?',
      answer: 'Não. 2026 é uma fase de teste com alíquotas experimentais (CBS 0,9% + IBS 0,1%, totalizando 1%). O recolhimento fica dispensado para quem cumpre as obrigações acessórias, conforme a Lei Complementar 214/2025, art. 348, § 1º. Na prática, é o ano de adaptar sistemas e notas fiscais, sem pagamento efetivo.'
    },
    {
      question: 'Tenho Simples Nacional, o que muda para mim?',
      answer: 'Para empresas do Simples Nacional, a discriminação das alíquotas de IBS e CBS nos documentos fiscais começa somente em 2027, conforme cronograma da Receita Federal e do Comitê Gestor do IBS. Em 2026, você está dispensado dessa discriminação, mas deve se preparar para 2027.'
    },
    {
      question: 'O que é CBS e IBS?',
      answer: 'CBS é a Contribuição sobre Bens e Serviços, um tributo federal que substitui PIS, Cofins e IPI. IBS é o Imposto sobre Bens e Serviços, um tributo de estados e municípios que substitui ICMS e ISS. Juntos, formam o chamado IVA Dual — dois impostos no formato de Imposto sobre Valor Agregado.'
    },
    {
      question: 'O PIX Automático é obrigatório para mim?',
      answer: 'Sim, o PIX Automático é obrigatório para empresas que fazem cobrança recorrente (mensalidades, assinaturas, etc.). Se sua empresa cobra valores recorrentes de clientes, você deve oferecer essa modalidade de pagamento.'
    },
    {
      question: 'O que acontece se eu não preencher os campos de IBS/CBS na nota?',
      answer: 'A partir de 03/08/2026, não é mais permitida a emissão de documentos fiscais eletrônicos sem o preenchimento dos campos de IBS e CBS para empresas do regime regular. Isso significa que seu sistema pode ser impedido de emitir notas sem esses campos. Verifique com seu contador se seu sistema já está adequado.'
    },
    {
      question: 'O que é o Imposto Seletivo?',
      answer: 'O Imposto Seletivo (IS) é um tributo adicional que incide sobre bens e serviços prejudiciais à saúde ou ao meio ambiente. Exemplos: cigarros e bebidas alcoólicas. É como um "imposto do pecado" — funciona para desestimular o consumo de produtos que fazem mal à saúde ou ao planeta.'
    },
    {
      question: 'Quando o ICMS e o ISS acabam?',
      answer: 'A extinção total do ICMS e do ISS ocorre em 2033. Entre 2029 e 2032, há uma transição gradual em que o IBS vai substituindo esses tributos aos poucos. Em 2033, o novo modelo estará plenamente vigente.'
    },
    {
      question: 'O que é o MED 2.0 do PIX?',
      answer: 'O MED 2.0 é o Mecanismo Especial de Devolução aprimorado, previsto na Resolução BCB nº 587 de 18/09/2026. Na prática, é um sistema que permite bloquear valores de um PIX quando há suspeita de fraude, protegendo tanto quem enviou quanto quem recebeu o pagamento.'
    },
    {
      question: 'O que é Split Tributário no PIX?',
      answer: 'O Split Tributário é uma iniciativa em evolução no PIX para identificar e separar automaticamente os valores de IBS e CBS no momento da transação. É a conexão direta entre a tecnologia do PIX e a Reforma Tributária. No futuro, isso simplificará muito a gestão dos impostos da sua empresa.'
    },
    {
      question: 'Como o escritório pode me ajudar?',
      answer: 'A equipe da OSL Contadores Associados pode ajudar você em todas as etapas: verificar se seu sistema está adequado para emitir notas com os campos de IBS/CBS, orientar sobre o cronograma aplicável ao seu regime tributário, avaliar a adoção do PIX Automático, treinar sua equipe e acompanhar toda a transição tributária até 2033. Entre em contato conosco!'
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="reveal text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Seção 5
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            As dúvidas mais comuns dos pequenos empresários, respondidas de forma clara e direta.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="reveal bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-primary text-sm sm:text-base pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 animate-fade-in">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SEÇÃO 6 — RODAPÉ / CONTATO
// ============================================
function Footer({ showToast }: { showToast: (msg: string) => void }) {
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = 'Informe seu nome';
    if (!formData.email.trim()) newErrors.email = 'Informe seu e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.mensagem.trim()) newErrors.mensagem = 'Escreva sua mensagem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      showToast('Mensagem enviada com sucesso!');
      setFormData({ nome: '', email: '', mensagem: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <footer id="contato" className="bg-primary-dark text-white">
      {/* Contato */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Texto */}
            <div className="reveal">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ficou com dúvida?
              </h2>
              <p className="text-xl text-blue-200 mb-6">
                Fale com a equipe da <strong className="text-white">OSL Contadores Associados</strong>
              </p>
              <p className="text-blue-200 leading-relaxed mb-8">
                Nossa equipe está pronta para ajudar você a navegar essas mudanças. 
                Envie sua dúvida e retornaremos o mais breve possível.
              </p>

              {/* Informações de contato */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-blue-100">fiscal@osl.com.br</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-light" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-blue-100">(35) 98871-1176</span>
                    <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-medium">WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="reveal">
              {submitted ? (
                <div className="bg-accent/20 border border-accent/30 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-white mb-2">Mensagem enviada!</h3>
                  <p className="text-blue-200">Obrigado pelo contato. Nossa equipe retornará em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-blue-200 mb-1.5">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                        errors.nome ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Seu nome completo"
                    />
                    {errors.nome && <p className="text-red-300 text-xs mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                        errors.email ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-blue-200 mb-1.5">
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      rows={4}
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-accent transition-colors resize-none ${
                        errors.mensagem ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="Escreva sua dúvida aqui..."
                    />
                    {errors.mensagem && <p className="text-red-300 text-xs mt-1">{errors.mensagem}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Enviar mensagem
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fontes e Referências */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="reveal">
            <h3 className="text-lg font-bold text-white mb-4">Fontes e Referências</h3>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-blue-200">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                Lei Complementar 214/2025
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                Comitê Gestor do IBS (cgibs.gov.br)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                Receita Federal do Brasil
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                Resolução BCB nº 587 de 18/09/2026
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                Banco Central do Brasil
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Avisos legais */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-blue-200">
                <strong className="text-white">Aviso importante:</strong> Este material tem caráter informativo e não substitui consulta personalizada com seu contador.
              </p>
            </div>
            <p className="text-xs text-blue-300/70 text-center sm:text-left">
              Informações baseadas na legislação e regulamentações vigentes em setembro de 2026.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">OSL</span>
              </div>
              <span className="text-sm text-blue-200">
                © 2026 OSL Contadores Associados. Todos os direitos reservados.
              </span>
            </div>
            <p className="text-xs text-blue-300/60">
              Conteúdo preparado pela equipe contábil da OSL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

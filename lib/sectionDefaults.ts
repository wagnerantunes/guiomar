export const SECTION_DEFAULTS = {
    hero: {
        title: "Consciência que transforma ambientes de trabalho",
        subtitle: "Bem-estar Corporativo",
        description: "Ajudamos empresas a criar culturas organizacionais mais saudáveis e produtivas.",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
        ],
        transitionEffect: "fade",
        duration: 5000,
        fontFamily: "Manrope",
        textColor: "#0d1b12",
        titleSize: 56,
        subtitleSize: 18,
        ctaText: "Agendar Consultoria",
        ctaUrl: "#contato",
        ctaColor: "#13ec5b"
    },
    sobre: {
        title: "Muito mais que uma consultoria comum",
        description: "A RenovaMente une ergonomia técnica e humanização para transformar empresas, considerando pessoas, processos e exigências legais.",
        experience: "30",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        fontFamily: "Manrope",
        textColor: "#0d1b12",
        bgColor: "#ffffff"
    },
    desafio: {
        title: "O desafio das empresas hoje",
        description: "Exigências como NR-1 e NR-17, somadas ao aumento de riscos psicossociais, tornam essencial uma atuação estruturada e preventiva.",
        statValue: "+30%",
        statLabel: "de produtividade em ambientes saudáveis",
        bgColor: "#0d1b12",
        textColor: "#ffffff"
    },
    servicos: {
        title: "Nossos Serviços",
        subtitle: "Soluções completas para sua empresa",
        items: [
            { t: "Ergonomia Legal", d: "Laudos NR-17 com foco em conformidade e saúde.", icon: "verified" },
            { t: "Riscos Psicossociais", d: "Análise ARP integrada ao seu PGR.", icon: "verified" },
            { t: "Clima Organizacional", d: "Diagnósticos para fortalecer relações internas.", icon: "verified" },
            { t: "Cultura & Valores", d: "Desenvolvimento de práticas corporativas sólidas.", icon: "verified" },
            { t: "Recrutamento", d: "Seleção humanizada alinhada ao propósito.", icon: "verified" },
            { t: "Treinamentos", d: "Capacitações práticas para equipes e gestores.", icon: "verified" },
        ],
        bgColor: "#f8f9fa",
        cardsPerView: 3,
        autoplay: true,
        infiniteScroll: true
    },
    metodologia: {
        title: "Metodologia RenovaMente",
        steps: [
            { t: "Diagnóstico Integrado", d: "Análise 360 do seu cenário atual." },
            { t: "Inventário de Riscos", d: "Identificação técnica de pontos críticos." },
            { t: "Plano de Ação", d: "Definição estratégica de soluções." },
            { t: "Implementação", d: "Execução acompanhada por especialistas." },
            { t: "Monitoramento", d: "Avaliação contínua de resultados." },
            { t: "Sustentação", d: "Consolidação de uma cultura saudável." },
        ]
    },
    porque: {
        title: "Por que a RenovaMente?",
        items: [
            { t: "Evolução Constante", d: "Entregamos transformação real, não apenas papéis." },
            { t: "Integração Total", d: "Razão e Emoção. Técnica e Humanização." },
            { t: "Segurança Jurídica", d: "Compliance total com as normas NR-17 e NR-1." },
        ]
    },
    guiomar: {
        title: "Sobre Guiomar Melo",
        description: "Fundadora da RenovaMente, Guiomar combina técnica e sensibilidade para apoiar empresas na construção de ambientes conscientes.",
        quote: "Transformar ambientes de trabalho começa pelo cuidado genuíno com as pessoas.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600"
    },
    faq: {
        title: "Dúvidas Frequentes",
        items: [
            { q: "Como funciona a consultoria?", r: "Nossa consultoria começa com um diagnóstico detalhado para entender as necessidades específicas da sua empresa." },
            { q: "Quais normas vocês atendem?", r: "Atendemos integralmente as normas NR-17 (Ergonomia) e NR-1 (Gerenciamento de Riscos), além de foco em riscos psicossociais." },
            { q: "O suporte é contínuo?", r: "Sim, oferecemos planos de acompanhamento para garantir a sustentação das mudanças implementadas." },
        ]
    },
    testimonials: {
        title: "Client Testimonials",
        items: [
            { name: "Sarah Johnson", role: "CTO, TechCorp", quote: "RenovaMente changed our entire office dynamic. Highly recommended for any growing team.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" },
            { name: "Michael Chen", role: "HR Director, Innovate", quote: "The workshops were incredibly engaging and practical.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200" }
        ],
        layout: "grid",
        backgroundImage: ""
    }
};

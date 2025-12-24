"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  cat: string;
  img: string;
  date: string;
  content?: string;
}

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "10 Técnicas de Mindfulness Corporativo para Gestores",
      cat: "PSICOLOGIA",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600",
      date: "24 Out, 2023",
      content: `O ambiente de trabalho moderno exige mais do que apenas produtividade; exige consciência. O Mindfulness, ou atenção plena, tem se mostrado uma das ferramentas mais eficazes para gestores que buscam reduzir o burnout e aumentar o engajamento.

      Neste artigo, exploramos técnicas práticas que podem ser aplicadas em reuniões, pausas de café e até mesmo durante a gestão de crises. A atenção plena não é apenas meditação; é uma forma de estar presente em cada decisão tomada.`,
    },
    {
      id: "2",
      title: "O ROI dos Programas de Saúde Mental nas Empresas",
      cat: "GESTÃO",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600",
      date: "20 Out, 2023",
      content: `Investir em saúde mental não é apenas uma questão ética, é uma estratégia financeira inteligente. Dados recentes mostram que empresas que investem em suporte emocional para seus colaboradores veem um retorno de até 4 dólares para cada 1 dólar investido.

      Isso se traduz em menos absenteísmo, maior retenção de talentos e uma marca empregadora muito mais forte no mercado competitivo de hoje.`,
    },
    {
      id: "3",
      title: "Ergonomia Legal: Guia Prático para Adequação à NR-17",
      cat: "ERGONOMIA",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
      date: "15 Out, 2023",
      content: `A NR-17 não deve ser vista apenas como uma obrigação legal, mas como um manual de otimização humana. Postos de trabalho mal projetados são os maiores vilões da produtividade silenciosa.

      Neste guia, desmistificamos os pontos principais da norma e oferecemos um checklist prático para pequenas e médias empresas começarem sua jornada de conformidade e cuidado ergonômico.`,
    },
  ];

  const scrollTo = (id: string) => {
    if (selectedPost) {
      setSelectedPost(null);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (selectedPost) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedPost]);

  return (
    <div className="min-h-screen bg-white text-text-dark font-display selection:bg-primary/30 scroll-smooth">
      {/* =============================================================================
          NAVBAR
          ============================================================================= */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedPost(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="material-symbols-outlined text-3xl text-primary transition-transform group-hover:rotate-12">
              spa
            </span>
            <span className="text-xl font-black tracking-tight text-[#0d1b12]">
              RenovaMente
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollTo("sobre")}
              className="text-xs font-black text-gray-500 hover:text-primary transition-colors tracking-widest"
            >
              SOBRE
            </button>
            <button
              onClick={() => scrollTo("servicos")}
              className="text-xs font-black text-gray-500 hover:text-primary transition-colors tracking-widest"
            >
              SERVIÇOS
            </button>
            <button
              onClick={() => scrollTo("metodologia")}
              className="text-xs font-black text-gray-500 hover:text-primary transition-colors tracking-widest"
            >
              METODOLOGIA
            </button>
            <button
              onClick={() => scrollTo("blog")}
              className="text-xs font-black text-gray-500 hover:text-primary transition-colors tracking-widest"
            >
              BLOG
            </button>
            <button
              onClick={() => scrollTo("contato")}
              className="text-xs font-black text-gray-500 hover:text-primary transition-colors tracking-widest"
            >
              CONTATO
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-black text-gray-400 hover:text-primary hover:border-primary/30 uppercase transition-all"
            >
              <span className="material-symbols-outlined text-sm">settings</span>{" "}
              ADMIN
            </Link>
            <a
              href="https://wa.me/5511994416024"
              className="bg-[#13ec5b] text-[#0d1b12] px-5 py-2.5 rounded-xl text-xs font-black hover:bg-[#0fdc53] shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              FALE CONOSCO
            </a>
          </div>
        </div>
      </nav>

      {selectedPost ? (
        /* VIEW DE ARTIGO ÚNICO */
        <div className="pt-20 animate-fadeIn">
          <article className="pb-24">
            <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
              <img
                src={selectedPost.img}
                className="w-full h-full object-cover"
                alt={selectedPost.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b12] to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-primary text-text-dark text-[10px] font-black uppercase tracking-widest">
                    {selectedPost.cat}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center gap-6 text-gray-300 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">
                        person
                      </span>{" "}
                      Por Guiomar Melo
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">
                        calendar_month
                      </span>{" "}
                      {selectedPost.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-3xl mx-auto px-6 mt-16">
              <button
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary transition-colors uppercase mb-12"
              >
                <span className="material-symbols-outlined">arrow_back</span>{" "}
                Voltar
              </button>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                {selectedPost.content?.split("\n").map((para, i) => (
                  <p key={i} className="mb-6">
                    {para}
                  </p>
                ))}
                <h2 className="text-3xl font-black text-[#0d1b12] mt-12 mb-6">
                  O bem-estar como estratégia
                </h2>
                <p>
                  Investir nas pessoas é o caminho mais curto para resultados
                  sustentáveis. Nossa consultoria ajuda você a pavimentar esse
                  caminho.
                </p>
              </div>
            </div>
          </article>
        </div>
      ) : (
        <>
          {/* SEÇÃO 01 - HERO */}
          <section
            id="hero"
            className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#102216]/95 via-[#102216]/80 to-transparent"></div>
            </div>
            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-white space-y-8 animate-fadeInLeft">
                <h1 className="text-4xl md:text-6xl font-black leading-[1.1]">
                  Consciência que transforma ambientes de trabalho
                </h1>
                <p className="text-lg md:text-xl font-bold text-primary italic">
                  Técnica, cuidado e gestão humana para sua empresa.
                </p>
                <button
                  onClick={() => scrollTo("servicos")}
                  className="bg-primary text-text-dark px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  NOSSOS SERVIÇOS
                </button>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl animate-fadeInRight max-w-md ml-auto">
                <h3 className="text-2xl font-black mb-6 text-[#0d1b12]">
                  Fale com um especialista
                </h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="Nome"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-100 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="email"
                    placeholder="E-mail Corporativo"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-100 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button className="w-full bg-[#0d1b12] text-white py-4 rounded-xl font-black text-sm hover:bg-black transition-all">
                    Solicitar Contato
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* SEÇÃO 02 - SOBRE NÓS */}
          <section id="sobre" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-3xl shadow-xl z-20 hidden md:block">
                  <span className="text-4xl font-black block text-text-dark tracking-tighter">
                    + DE 30
                  </span>
                  <span className="text-[10px] font-bold text-text-dark uppercase tracking-widest leading-none">
                    Anos de Experiência
                  </span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                  className="rounded-[3rem] shadow-2xl w-full aspect-[4/3] object-cover relative z-10"
                  alt="Sobre"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-[3rem] -rotate-3 -z-0"></div>
              </div>
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                  SOBRE NÓS
                </div>
                <h2 className="text-4xl font-black text-[#0d1b12]">
                  Muito mais que uma consultoria comum
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  A RenovaMente une ergonomia técnica e humanização para
                  transformar empresas, considerando pessoas, processos e
                  exigências legais.
                </p>
              </div>
            </div>
          </section>

          {/* SEÇÃO 03 - O DESAFIO */}
          <section id="desafio" className="py-24 bg-[#0d1b12] text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 space-y-6">
                <h2 className="text-4xl font-black">O desafio das empresas hoje</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Exigências como NR-1 e NR-17, somadas ao aumento de riscos
                  psicossociais, tornam essencial uma atuação estruturada e
                  preventiva.
                </p>
              </div>
              <div className="lg:col-span-4">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center">
                  <span className="text-7xl font-black text-primary block">
                    +30%
                  </span>
                  <span className="text-xs font-bold text-gray-300 uppercase mt-4 block">
                    de produtividade em ambientes saudáveis
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO 04 - SERVIÇOS */}
          <section id="servicos" className="py-24 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl font-black text-[#0d1b12]">
                  Nossos Serviços
                </h2>
                <p className="text-lg text-gray-500 font-bold italic">
                  Soluções completas para sua empresa
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    t: "Ergonomia Legal",
                    d: "Laudos NR-17 com foco em conformidade e saúde.",
                  },
                  {
                    t: "Riscos Psicossociais",
                    d: "Análise ARP integrada ao seu PGR.",
                  },
                  {
                    t: "Clima Organizacional",
                    d: "Diagnósticos para fortalecer relações internas.",
                  },
                  {
                    t: "Cultura & Valores",
                    d: "Desenvolvimento de práticas corporativas sólidas.",
                  },
                  {
                    t: "Recrutamento",
                    d: "Seleção humanizada alinhada ao propósito.",
                  },
                  {
                    t: "Treinamentos",
                    d: "Capacitações práticas para equipes e gestores.",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-primary/40 hover:shadow-2xl transition-all group"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl">
                        verified
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#0d1b12] mb-4">
                      {s.t}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SEÇÃO 05 - METODOLOGIA */}
          <section
            id="metodologia"
            className="py-24 px-6 bg-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-[#0d1b12] text-center mb-20">
                Metodologia RenovaMente
              </h2>
              <div className="relative space-y-12">
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2"></div>
                {[
                  {
                    t: "Diagnóstico Integrado",
                    d: "Análise 360 do seu cenário atual.",
                  },
                  {
                    t: "Inventário de Riscos",
                    d: "Identificação técnica de pontos críticos.",
                  },
                  {
                    t: "Plano de Ação",
                    d: "Definição estratégica de soluções.",
                  },
                  {
                    t: "Implementação",
                    d: "Execução acompanhada por especialistas.",
                  },
                  {
                    t: "Monitoramento",
                    d: "Avaliação contínua de resultados.",
                  },
                  {
                    t: "Sustentação",
                    d: "Consolidação de uma cultura saudável.",
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""
                      }`}
                  >
                    <div className="flex-1 w-full lg:text-right">
                      {i % 2 === 0 && (
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                          <h4 className="text-xl font-black text-primary mb-2">
                            0{i + 1}. {m.t}
                          </h4>
                          <p className="text-sm text-gray-500">{m.d}</p>
                        </div>
                      )}
                    </div>
                    <div className="size-12 rounded-full bg-primary flex items-center justify-center text-text-dark font-black z-20 border-4 border-white shadow-lg shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 w-full lg:text-left">
                      {i % 2 !== 0 && (
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                          <h4 className="text-xl font-black text-primary mb-2">
                            0{i + 1}. {m.t}
                          </h4>
                          <p className="text-sm text-gray-500">{m.d}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SEÇÃO 06 - BLOG */}
          <section
            id="blog"
            className="py-24 bg-white px-6 border-t border-gray-50"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase mb-4 tracking-widest">
                    NOSSO BLOG
                  </div>
                  <h2 className="text-4xl font-black text-[#0d1b12]">
                    Insights & Bem-estar
                  </h2>
                </div>
                <button
                  className="text-xs font-black text-primary uppercase border-b-2 border-primary pb-1"
                  onClick={() => scrollTo("blog")}
                >
                  Ver todos
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-6">
                      <img
                        src={post.img}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        alt={post.title}
                      />
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {post.date}
                      </span>
                      <h3 className="text-xl font-black text-[#0d1b12] group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        Ler artigo{" "}
                        <span className="material-symbols-outlined text-[14px]">
                          arrow_right_alt
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SEÇÃO 07 - POR QUE RENOVAMENTE? */}
          <section id="porque" className="py-24 bg-primary/5 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-[#0d1b12] text-center mb-16">
                Por que a RenovaMente?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    t: "Evolução Constante",
                    d: "Entregamos transformação real, não apenas papéis.",
                  },
                  {
                    t: "Integração Total",
                    d: "Razão e Emoção. Técnica e Humanização.",
                  },
                  {
                    t: "Segurança Jurídica",
                    d: "Compliance total com as normas NR-17 e NR-1.",
                  },
                ].map((v, i) => (
                  <div
                    key={i}
                    className="bg-white p-10 rounded-[2.5rem] border border-gray-100 text-center space-y-4"
                  >
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                      <span className="material-symbols-outlined font-bold">
                        verified_user
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#0d1b12]">{v.t}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{v.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SEÇÃO 08 - SOBRE GUIOMAR */}
          <section
            id="guiomar"
            className="py-24 px-6 bg-white overflow-hidden relative"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-8">
                <h2 className="text-4xl font-black text-[#0d1b12]">
                  Sobre Guiomar Melo
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Fundadora da RenovaMente, Guiomar combina técnica e
                  sensibilidade para apoiar empresas na construção de ambientes
                  conscientes.
                </p>
                <div className="bg-primary/5 p-10 rounded-[2.5rem] border-l-8 border-primary relative">
                  <span className="material-symbols-outlined absolute -top-4 right-8 text-primary opacity-20 text-7xl select-none">
                    format_quote
                  </span>
                  <p className="text-xl font-black text-[#0d1b12] italic leading-snug">
                    "Transformar ambientes de trabalho começa pelo cuidado
                    genuíno com as pessoas."
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-primary rounded-[3rem] rotate-6 scale-95 opacity-50"></div>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600"
                    className="rounded-[3rem] shadow-2xl relative z-10 w-full aspect-[4/5] object-cover border-4 border-white"
                    alt="Guiomar"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO 09 - FAQ */}
          <section id="faq" className="py-24 bg-gray-50 px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-black text-[#0d1b12] text-center mb-12">
                Dúvidas Frequentes
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "A consultoria atende PMEs?",
                    r: "Sim, nosso foco principal são empresas de 10 a 500 colaboradores.",
                  },
                  {
                    q: "Ergonomia é obrigatória?",
                    r: "Sim, a NR-17 exige avaliações ergonômicas periódicas.",
                  },
                  {
                    q: "Atendem em outros estados?",
                    r: "Sim, possuímos modelos de atendimento híbrido e presencial.",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full px-8 py-6 flex items-center justify-between text-left group"
                    >
                      <span className="font-black text-[#0d1b12] group-hover:text-primary transition-colors">
                        {f.q}
                      </span>
                      <span
                        className={`material-symbols-outlined transition-transform duration-300 ${activeFaq === i ? "rotate-180 text-primary" : "text-gray-400"
                          }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {activeFaq === i && (
                      <div className="px-8 pb-6 text-sm text-gray-500 border-t border-gray-50 pt-5">
                        {f.r}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SEÇÃO 10 - CONTATO */}
          <section id="contato" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 bg-[#0d1b12] text-white p-12 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden">
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 opacity-5 text-[200px]">
                  contact_support
                </span>
                <h2 className="text-4xl font-black">Vamos conversar?</h2>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">
                      call
                    </span>{" "}
                    (11) 99441-6024
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">
                      mail
                    </span>{" "}
                    renova@renovamente.com.br
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
                <form
                  className="grid grid-cols-1 gap-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    placeholder="Seu Nome"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Seu E-mail"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                  <textarea
                    rows={4}
                    placeholder="Como podemos ajudar?"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent text-sm focus:ring-2 focus:ring-primary/40 outline-none resize-none"
                  ></textarea>
                  <button className="bg-[#0d1b12] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-100 py-20 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">
                spa
              </span>
              <span className="text-xl font-black text-[#0d1b12]">
                RenovaMente
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Transformando ambientes de trabalho com técnica e humanização.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">
              Explore
            </h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li>
                <button
                  onClick={() => scrollTo("sobre")}
                  className="hover:text-primary transition-colors"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("servicos")}
                  className="hover:text-primary transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("blog")}
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h4 className="text-xs font-black mb-4">Newsletter</h4>
            <div className="flex flex-col gap-2">
              <input
                className="bg-gray-50 border-none rounded-xl text-xs py-2 px-4"
                placeholder="Seu e-mail"
              />
              <button className="bg-primary text-text-dark font-black py-2 rounded-xl text-[10px] uppercase">
                Assinar
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
          © 2024 RenovaMente Consultoria de Bem-Estar. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  );
}

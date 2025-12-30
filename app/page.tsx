"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { AboutUs } from "@/components/landing/AboutUs";
import { Challenge } from "@/components/landing/Challenge";
import { Services } from "@/components/landing/Services";
import { Methodology } from "@/components/landing/Methodology";
import { BlogPreview } from "@/components/landing/BlogPreview";
import { WhyUs } from "@/components/landing/WhyUs";
import { Founder } from "@/components/landing/Founder";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";
import { AnalyticsTracker } from "@/components/landing/AnalyticsTracker";
import { ToastProvider, useToast } from "@/components/ui/ToastProvider";
import { RichText } from "@/components/ui/RichText";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";

interface BlogPost {
  id: string;
  title: string;
  cat: string;
  img: string;
  date: string;
  content?: string;
}

function HomePageContent() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [siteSettings, setSiteSettings] = useState<any[]>([]);
  const [siteData, setSiteData] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { toast } = useToast();


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
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    const fetchSiteData = async () => {
      try {
        const res = await fetch("/api/settings/site");
        if (res.ok) {
          const data = await res.json();
          setSiteData(data);
        }
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          const transformed = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            cat: p.category?.name || "GERAL",
            img: p.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600",
            date: new Date(p.createdAt).toLocaleDateString("pt-BR", { day: 'numeric', month: 'short', year: 'numeric' }),
            content: p.content
          }));
          setBlogPosts(transformed);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchSettings();
    fetchSiteData();
    fetchPosts();
  }, []);

  const getSetting = (key: string, defaultValue: any) => {
    const setting = siteSettings.find(s => s.key === key);
    if (!setting) return defaultValue;

    // If the key indicates section content, it's stored as a JSON string
    if (key.includes("_content")) {
      try {
        let parsed = setting.value;
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
          } catch (e) {
            // If it's a string but NOT JSON, we still need to return an object if defaultValue is an object
            if (typeof defaultValue === 'object' && defaultValue !== null) {
              return defaultValue;
            }
            return parsed;
          }
        }

        // Final safety check: if we expect an object but got something else (like null or string)
        if (typeof defaultValue === 'object' && defaultValue !== null) {
          if (typeof parsed !== 'object' || parsed === null) {
            return defaultValue;
          }
          return { ...defaultValue, ...parsed };
        }

        return parsed || defaultValue;
      } catch (e) {
        return defaultValue;
      }
    }

    return setting.value || defaultValue;
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        setNewsletterStatus("success");
        setNewsletterEmail("");
        toast({
          title: "Inscrição realizada!",
          description: "Você receberá nossas novidades em breve.",
          type: "success"
        });
        setTimeout(() => setNewsletterStatus("idle"), 2000);
      } else {
        setNewsletterStatus("error");
        toast({
          title: "Erro na inscrição",
          description: "Por favor, tente novamente.",
          type: "error"
        });
        setTimeout(() => setNewsletterStatus("idle"), 3000);
      }
    } catch (error) {
      setNewsletterStatus("error");
      toast({
        title: "Erro de conexão",
        description: "Verifique sua internet e tente novamente.",
        type: "error"
      });
      setTimeout(() => setNewsletterStatus("idle"), 3000);
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
        {siteSettings[0]?.siteId && <AnalyticsTracker siteId={siteSettings[0].siteId} />}
        <Header
          getSetting={getSetting}
          scrollTo={scrollTo}
          setSelectedPost={setSelectedPost}
          logo={siteData?.logo}
          logoLight={siteData?.logoLight}
          logoDark={siteData?.logoDark}
          settings={siteData?.settings}
        />

        {selectedPost ? (
          <article className="pt-32 pb-20 px-6 animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => setSelectedPost(null)}
                className="mb-8 flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Voltar para o Início
              </button>
              <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl">
                <img src={selectedPost.img} className="w-full h-full object-cover" alt={selectedPost.title} />
              </div>
              <div className="space-y-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  {selectedPost.cat}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                  {selectedPost.title}
                </h1>
                <p className="text-muted font-bold uppercase tracking-widest text-xs">
                  {selectedPost.date}
                </p>
                <RichText
                  content={selectedPost.content || ""}
                  className="prose-lg text-muted leading-relaxed font-medium"
                />
              </div>
            </div>
          </article>
        ) : (
          <div className="overflow-x-hidden">
            {(() => {
              const defaultOrderArr = [
                "hero", "sobre", "desafio", "servicos", "metodologia", "blog", "porque", "guiomar", "testimonials", "faq", "contato"
              ];
              let rawOrder = getSetting("landing_section_order", defaultOrderArr);

              // Helper to parse if string
              if (typeof rawOrder === 'string') {
                try {
                  rawOrder = JSON.parse(rawOrder);
                } catch (e) {
                  rawOrder = defaultOrderArr;
                }
              }

              // Helper to ensure array
              if (!Array.isArray(rawOrder)) {
                rawOrder = defaultOrderArr;
              }

              // Ensure we use the correct IDs even if old ones are stored in the database
              const orderArr = rawOrder.map((id: string) => {
                if (id === "challenge") return "desafio";
                if (id === "whyus") return "porque";
                if (id === "founder") return "guiomar";
                return id;
              });

              // Filter only visible sections for proper nextId calculation
              const visibleSections = orderArr.filter((id: string) => {
                const defaults = (SECTION_DEFAULTS as any)[id] || {};
                // Special check for hero which might not be in SECTION_DEFAULTS or has different key structure
                if (id === "hero") return getSetting("section_hero_content", { ...SECTION_DEFAULTS.hero, isVisible: true }).isVisible !== false;
                return getSetting(`section_${id}_content`, { ...defaults, isVisible: true }).isVisible !== false;
              });

              return visibleSections.map((id: string, index: number) => {
                const nextId = visibleSections[index + 1];

                switch (id) {
                  case "hero":
                    return <Hero key={id} getSetting={getSetting} scrollTo={scrollTo} nextId={nextId} />;
                  case "sobre":
                    return (
                      <SectionWrapper key={id} id="sobre" nextId={nextId} variant="muted" content={getSetting("section_sobre_content", SECTION_DEFAULTS.sobre)}>
                        <AboutUs getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  case "desafio":
                    return (
                      <SectionWrapper key={id} id="desafio" nextId={nextId} variant="default" content={getSetting("section_desafio_content", SECTION_DEFAULTS.desafio)}>
                        <Challenge getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  case "servicos":
                    return (
                      <SectionWrapper key={id} id="servicos" nextId={nextId} variant="muted" content={getSetting("section_servicos_content", SECTION_DEFAULTS.servicos)}>
                        <Services getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  case "metodologia":
                    return (
                      <SectionWrapper key={id} id="metodologia" nextId={nextId} variant="default" content={getSetting("section_metodologia_content", SECTION_DEFAULTS.metodologia)}>
                        <Methodology getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  case "blog":
                    return (
                      <SectionWrapper key={id} id="blog" nextId={nextId} variant="muted" content={getSetting("section_blog_content", { isVisible: true })}>
                        <BlogPreview
                          getSetting={getSetting}
                          blogPosts={blogPosts}
                          setSelectedPost={setSelectedPost}
                          scrollTo={scrollTo}
                        />
                      </SectionWrapper>
                    );
                  case "porque":
                    return (
                      <SectionWrapper key={id} id="porque" nextId={nextId} variant="default" content={getSetting("section_porque_content", SECTION_DEFAULTS.porque)}>
                        <WhyUs getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  case "guiomar":
                    return (
                      <SectionWrapper key={id} id="guiomar" nextId={nextId} variant="muted" content={getSetting("section_guiomar_content", SECTION_DEFAULTS.guiomar)}>
                        <Founder getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  case "testimonials":
                    return (
                      <SectionWrapper key={id} id="testimonials" nextId={nextId} variant="default" content={getSetting("section_testimonials_content", SECTION_DEFAULTS.testimonials)}>
                        <Testimonials getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  case "faq":
                    return (
                      <SectionWrapper key={id} id="faq" nextId={nextId} variant="muted" content={getSetting("section_faq_content", SECTION_DEFAULTS.faq)}>
                        <FAQ getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  case "contato":
                    return (
                      <SectionWrapper key={id} id="contato" variant="default" content={getSetting("section_contato_content", SECTION_DEFAULTS.contato)}>
                        <Contact getSetting={getSetting} />
                      </SectionWrapper>
                    );
                  default:
                    return null;
                }
              });
            })()}
          </div>

        )}

        <Footer
          getSetting={getSetting}
          scrollTo={scrollTo}
          handleNewsletterSubmit={handleNewsletterSubmit}
          newsletterEmail={newsletterEmail}
          setNewsletterEmail={setNewsletterEmail}
          newsletterStatus={newsletterStatus}
          logo={siteData?.logo}
          logoLight={siteData?.logoLight}
          logoDark={siteData?.logoDark}
          settings={siteData?.settings}
        />
      </div>
    </ToastProvider>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <HomePageContent />
    </ToastProvider>
  );
}

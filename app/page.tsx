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
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-primary/30">
        {siteSettings[0]?.siteId && <AnalyticsTracker siteId={siteSettings[0].siteId} />}
        <Header
          getSetting={getSetting}
          scrollTo={scrollTo}
          setSelectedPost={setSelectedPost}
          logo={siteData?.logoLight || siteData?.logo}
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
                <h1 className="text-4xl md:text-5xl font-black text-[#0d1b12] leading-tight">
                  {selectedPost.title}
                </h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  {selectedPost.date}
                </p>
                <RichText
                  content={selectedPost.content || ""}
                  className="prose-lg text-gray-600 leading-relaxed font-medium"
                />
              </div>
            </div>
          </article>
        ) : (
          <div className="overflow-x-hidden">
            <Hero getSetting={getSetting} scrollTo={scrollTo} />

            <SectionWrapper id="sobre">
              <AboutUs getSetting={getSetting} />
            </SectionWrapper>

            <SectionWrapper id="challenge">
              <Challenge getSetting={getSetting} />
            </SectionWrapper>

            <SectionWrapper id="servicos">
              <Services getSetting={getSetting} />
            </SectionWrapper>

            <SectionWrapper id="metodologia">
              <Methodology getSetting={getSetting} />
            </SectionWrapper>

            <SectionWrapper id="blog">
              <BlogPreview
                getSetting={getSetting}
                blogPosts={blogPosts}
                setSelectedPost={setSelectedPost}
                scrollTo={scrollTo}
              />
            </SectionWrapper>

            <SectionWrapper>
              <WhyUs getSetting={getSetting} />
            </SectionWrapper>

            <SectionWrapper>
              <Founder getSetting={getSetting} />
            </SectionWrapper>

            <SectionWrapper id="testimonials">
              <Testimonials getSetting={getSetting} />
            </SectionWrapper>

            <SectionWrapper>
              <FAQ getSetting={getSetting} />
            </SectionWrapper>

            <SectionWrapper id="contato">
              <Contact getSetting={getSetting} />
            </SectionWrapper>
          </div>
        )}

        <Footer
          getSetting={getSetting}
          scrollTo={scrollTo}
          handleNewsletterSubmit={handleNewsletterSubmit}
          newsletterEmail={newsletterEmail}
          setNewsletterEmail={setNewsletterEmail}
          newsletterStatus={newsletterStatus}
          logo={siteData?.logoDark || siteData?.logo}
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

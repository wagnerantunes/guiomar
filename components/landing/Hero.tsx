"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { useToast } from "@/components/ui/ToastProvider";
import { RichText } from "@/components/ui/RichText";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import Image from "next/image";

import { AntigravityParticles } from "@/components/ui/AntigravityParticles";

interface HeroProps {
    getSetting: (key: string, defaultValue: any) => any;
    scrollTo: (id: string) => void;
    nextId?: string;
}

export function Hero({ getSetting, scrollTo, nextId }: HeroProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [currentSlide, setCurrentSlide] = useState(0);
    const { toast } = useToast();

    const heroData = getSetting("section_hero_content", SECTION_DEFAULTS.hero);

    // Handle Visibility
    if (heroData?.isVisible === false) return null;

    const rawSlides = (heroData.images || [heroData.image]).filter(Boolean);
    // Ensure at least one slide exists to prevent index crash
    const slides = rawSlides.length > 0 ? rawSlides : [""];

    const currentItem = slides[currentSlide];
    // Safe accessors handling both string (legacy) and object slide data
    const getSlideVal = (key: string, fallback: any) => {
        if (!currentItem) return fallback;
        if (typeof currentItem === 'string') return fallback;
        return currentItem[key] || fallback;
    };

    // Determine image source
    const bgImage = typeof currentItem === 'string' ? currentItem : (currentItem?.image || "");

    const displayTitle = getSlideVal('title', heroData.title);
    const displaySubtitle = getSlideVal('subtitle', heroData.subtitle);
    const displayBody = getSlideVal('body', heroData.description);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 400 };
    const dx = useSpring(mouseX, springConfig);
    const dy = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, heroData.duration || 5000);
        return () => clearInterval(interval);
    }, [slides.length, heroData.duration]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            company: formData.get("company"),
            phone: formData.get("phone"),
            message: `CONTATO VIA HERO. Cliente: ${formData.get("name")} (@${formData.get("company")}). Interessado em consultoria profissional.`,
            source: "Hero Section Lead Form",
            domain: window.location.hostname
        };

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
                toast({
                    title: "Mensagem enviada com sucesso!",
                    description: "Entraremos em contato em breve.",
                    type: "success"
                });
                setTimeout(() => setStatus("idle"), 2000);
            } else {
                setStatus("error");
                toast({
                    title: "Erro ao enviar mensagem",
                    description: "Por favor, tente novamente.",
                    type: "error"
                });
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch (err) {
            setStatus("error");
            toast({
                title: "Erro de conexão",
                description: "Verifique sua internet e tente novamente.",
                type: "error"
            });
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section
            id="hero"
            className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden min-h-[600px] flex items-center"
        >
            {/* BACKGROUND SLIDER */}
            <div className="absolute inset-0 z-0">
                {bgImage ? (
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={bgImage}
                                alt="Ambiente corporativo moderno com foco em bem-estar e ergonomia no trabalho"
                                fill
                                priority={currentSlide === 0}
                                sizes="100vw"
                                quality={90}
                                className="object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="w-full h-full bg-background" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
            </div>

            {/* ... */}

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="text-foreground space-y-8 animate-fadeInLeft lg:col-span-7">
                    <motion.p
                        key={currentSlide + "subtitle"}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="type-badge text-primary bg-primary/20 px-4 py-2 rounded-full inline-block border border-primary/20 mb-6 backdrop-blur-md normal-case tracking-normal"
                        style={{ textTransform: 'none', letterSpacing: '0px' }}
                    >
                        {displaySubtitle}
                    </motion.p>
                    <motion.h1
                        key={currentSlide + "title"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-5xl md:text-6xl font-black text-foreground drop-shadow-sm max-w-3xl leading-[1.1] tracking-wide mb-8"
                        style={{ textWrap: "balance" } as any}
                    >
                        {displayTitle}
                    </motion.h1>

                    <div className="mt-8">
                        <RichText
                            content={displayBody}
                            className="type-body text-muted-foreground max-w-2xl drop-shadow-sm text-lg leading-relaxed"
                        />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="relative inline-block"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ x: dx, y: dy }}
                    >
                        <button
                            onClick={() => scrollTo("servicos")}
                            className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest relative z-10"
                        >
                            {heroData.ctaText || "NOSSOS SERVIÇOS"}
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="lg:col-span-4 lg:col-start-9 bg-card/40 backdrop-blur-2xl p-8 md:p-10 rounded-[2rem] shadow-2xl w-full ml-auto border border-border"
                >
                    <div className="mb-6">
                        <h3 className="text-xl md:text-2xl font-black text-foreground">
                            Transforme seu ambiente de trabalho
                        </h3>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-2">
                            Consultoria técnica e humanizada
                        </p>
                    </div>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Seu nome"
                                className="w-full px-5 py-4 rounded-xl bg-muted/5 border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Seu melhor e-mail corporativo"
                                className="w-full px-5 py-4 rounded-xl bg-muted/5 border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="company"
                                required
                                placeholder="Nome da empresa"
                                className="w-full px-5 py-4 rounded-xl bg-muted/5 border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="phone"
                                required
                                placeholder="WhatsApp com DDD"
                                className="w-full px-5 py-4 rounded-xl bg-muted/5 border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-xs hover:bg-foreground hover:text-background transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest mt-2 shadow-lg shadow-primary/10"
                        >
                            {status === "loading" ? "Enviando..." :
                                status === "success" ? "Solicitação Enviada!" :
                                    status === "error" ? "Erro ao Enviar" : "SOLICITAR CONTATO"}
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Slider Dots */}
            {
                slides.length > 1 && (
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {slides.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? "w-10 bg-primary shadow-lg shadow-primary/30" : "w-4 bg-white/30 hover:bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                )
            }
        </section >
    );
}

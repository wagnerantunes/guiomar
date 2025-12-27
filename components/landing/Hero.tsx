"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { useToast } from "@/components/ui/ToastProvider";
import { RichText } from "@/components/ui/RichText";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";

interface HeroProps {
    getSetting: (key: string, defaultValue: any) => any;
    scrollTo: (id: string) => void;
}

export function Hero({ getSetting, scrollTo }: HeroProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [currentSlide, setCurrentSlide] = useState(0);
    const { toast } = useToast();

    const heroData = getSetting("section_hero_content", SECTION_DEFAULTS.hero);
    const slides = (heroData.images || [heroData.image]).filter(Boolean);

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
                {slides.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        <motion.img
                            key={currentSlide}
                            src={slides[currentSlide]}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-full h-full object-cover"
                            alt={`Hero Slide ${currentSlide + 1}`}
                        />
                    </AnimatePresence>
                ) : (
                    <div className="w-full h-full bg-zinc-950" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-white space-y-8 animate-fadeInLeft">
                    {heroData.subtitle && (
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl font-bold text-primary italic max-w-xl"
                        >
                            {heroData.subtitle}
                        </motion.p>
                    )}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-4xl md:text-6xl font-black leading-[1.1]"
                        style={{ fontSize: heroData.titleSize ? `${heroData.titleSize}px` : undefined }}
                    >
                        {heroData.title}
                    </motion.h1>
                    <RichText
                        content={heroData.description}
                        className="text-base md:text-lg font-medium text-gray-300 max-w-xl prose-invert"
                    />
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
                            className="bg-primary text-black px-10 py-5 rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest relative z-10"
                        >
                            {heroData.ctaText || "NOSSOS SERVIÇOS"}
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="bg-white/[0.03] backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl max-w-md ml-auto border border-white/10"
                >
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-white">
                            Transforme seu ambiente de trabalho
                        </h3>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-3">
                            Consultoria técnica e humanizada
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Seu Nome</label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Seu nome"
                                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="seu@email.com"
                                className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Empresa</label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    placeholder="Nome da empresa"
                                    className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">WhatsApp</label>
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    placeholder="(11) 99999-9999"
                                    className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/20"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-primary text-black py-5 rounded-2xl font-black text-xs hover:bg-primary-light transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest mt-4 shadow-lg shadow-primary/10"
                        >
                            {status === "loading" ? "Enviando..." :
                                status === "success" ? "Solicitação Enviada!" :
                                    status === "error" ? "Erro ao Enviar" : "Solicitar Contato"}
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Slider Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {slides.map((_: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? "w-10 bg-primary shadow-lg shadow-primary/30" : "w-4 bg-white/30 hover:bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            )}

            <ScrollIndicator targetId="sobre" />
        </section>
    );
}

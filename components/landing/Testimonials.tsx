"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { motion } from "framer-motion";

interface TestimonialsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Testimonials({ getSetting }: TestimonialsProps) {
    const data = getSetting("section_testimonials_content", {
        title: "O que nossos clientes dizem",
        items: [
            { id: 1, name: "Sarah Johnson", role: "Digital Strategy", quote: "A RenovaMente transformou nossa dinâmica de trabalho. Recomendo fortemente.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" },
            { id: 2, name: "Michael Chen", role: "Sales Director", quote: "Estratégias impecáveis e suporte humanizado. Um divisor de águas.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200" },
            { id: 3, name: "Elena Rodriguez", role: "Marketing Manager", quote: "Atenção aos detalhes e resultados que superaram nossas expectativas.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200" },
            { id: 4, name: "David Kim", role: "CEO, TechFlow", quote: "Equipe extremamente profissional e competente. Resultados sólidos.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" }
        ]
    });

    const items = [...data.items, ...data.items]; // Duplicar para loop infinito

    return (
        <section id="depoimentos" className="py-32 bg-background relative overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Experiências</span>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic">
                        {data.title}
                    </h2>
                </div>

                <div
                    className="relative"
                    style={{
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                >
                    <motion.div
                        className="flex gap-8"
                        animate={{
                            x: [0, -2000],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30,
                                ease: "linear",
                            },
                        }}
                    >
                        {items.map((t: any, i: number) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-[400px] bg-card backdrop-blur-xl p-10 rounded-[3rem] border border-border shadow-xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

                                <div className="flex gap-1 mb-8">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-primary text-lg fill-primary">star</span>
                                    ))}
                                </div>

                                <div className="mb-10 min-h-[120px]">
                                    <p className="text-lg text-foreground font-medium italic leading-relaxed">
                                        "{t.quote}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-5 border-t border-border pt-8">
                                    <img
                                        src={t.image || `https://ui-avatars.com/api/?name=${t.name}&background=random&color=fff`}
                                        className="size-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-border"
                                        alt={t.name}
                                    />
                                    <div>
                                        <p className="font-black text-foreground uppercase tracking-tight italic">{t.name}</p>
                                        <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mt-1">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

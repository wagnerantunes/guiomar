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
        <section id="testimonials" className="py-32 bg-[#09090b] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24 space-y-6">
                    <span className="text-[10px] font-black text-[#13ec5b] uppercase tracking-[0.4em]">Depoimentos</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                        {data.title}
                    </h2>
                </div>

                <div className="relative">
                    {/* Gradient Overlays for Edge Fading */}
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#09090b] to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#09090b] to-transparent z-20 pointer-events-none" />

                    <motion.div
                        className="flex gap-8"
                        animate={{
                            x: [0, -100 * (data.items.length) + "%"]
                        }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                        style={{ width: "fit-content" }}
                    >
                        {items.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="w-[400px] shrink-0 bg-white/[0.03] backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 hover:border-[#13ec5b]/30 transition-all duration-500 group relative"
                            >
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#13ec5b]/5 rounded-full blur-2xl group-hover:bg-[#13ec5b]/10 transition-colors"></div>

                                <div className="flex flex-col h-full justify-between gap-10">
                                    <div className="relative">
                                        <span className="material-symbols-outlined text-5xl text-[#13ec5b] opacity-20 absolute -top-2 -left-2 select-none">
                                            format_quote
                                        </span>
                                        <p className="relative z-10 text-lg text-zinc-400 font-medium leading-relaxed italic">
                                            "{item.quote}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-5 border-t border-white/5 pt-8">
                                        <div className="size-12 rounded-full overflow-hidden border border-white/10 group-hover:border-[#13ec5b]/50 transition-colors">
                                            <img
                                                src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=13ec5b&color=0d1b12`}
                                                alt={item.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white text-sm uppercase tracking-wider">
                                                {item.name}
                                            </h4>
                                            <p className="text-[#13ec5b] font-black text-[9px] uppercase tracking-[0.2em] mt-1">
                                                {item.role}
                                            </p>
                                        </div>
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

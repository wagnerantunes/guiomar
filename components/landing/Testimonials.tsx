"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        <section id="testimonials" className="py-24 bg-white dark:bg-[#09090b] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-[var(--color-text-main)] dark:text-white uppercase tracking-tighter">
                        {data.title}
                    </h2>
                    <div className="w-12 h-1.5 bg-[#13ec5b] mx-auto rounded-full" />
                </div>

                <div className="relative mt-20">
                    {/* Gradient Overlays for Edge Fading */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-[#09090b] to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-[#09090b] to-transparent z-10 pointer-events-none" />

                    <motion.div
                        className="flex gap-8"
                        animate={{
                            x: [0, -100 * (data.items.length) + "%"]
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                        style={{ width: "fit-content" }}
                    >
                        {items.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="w-[350px] md:w-[450px] shrink-0 bg-[#f8faf8] dark:bg-white/5 p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none hover:border-[#13ec5b]/30 transition-all group"
                            >
                                <div className="flex flex-col h-full justify-between gap-8">
                                    <div className="relative">
                                        <span className="material-symbols-outlined text-6xl text-[#13ec5b]/10 absolute -top-4 -left-2 select-none">
                                            format_quote
                                        </span>
                                        <p className="relative z-10 text-base md:text-lg text-[var(--color-text-main)] dark:text-gray-300 font-medium leading-relaxed italic">
                                            "{item.quote}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="size-14 rounded-2xl overflow-hidden border-2 border-white dark:border-[#13ec5b]/20 shadow-md group-hover:scale-110 transition-transform">
                                            <img
                                                src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=13ec5b&color=0d1b12`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[var(--color-text-main)] dark:text-white text-sm uppercase tracking-wider">
                                                {item.name}
                                            </h4>
                                            <p className="text-[#13ec5b] font-black text-[9px] uppercase tracking-[0.2em] mt-0.5">
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

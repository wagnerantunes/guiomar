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
            { name: "Sarah Johnson", role: "CTO, TechCorp", quote: "RenovaMente changed our entire office dynamic. Highly recommended for any growing team.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" },
            { name: "Michael Chen", role: "HR Director, Innovate", quote: "The workshops were incredibly engaging and practical.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200" }
        ]
    });

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (data.items.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % data.items.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [data.items.length]);

    return (
        <section id="testimonials" className="py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-[var(--color-text-main)]">
                        {data.title}
                    </h2>
                    <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto rounded-full" />
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-[var(--color-background-light)]/20 p-12 md:p-16 rounded-[3rem] border border-gray-100 shadow-xl relative overflow-hidden"
                        >
                            <span className="material-symbols-outlined absolute top-10 left-10 text-9xl text-[var(--color-primary)]/5 select-none pointer-events-none">
                                format_quote
                            </span>

                            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                                <p className="text-xl md:text-2xl text-[var(--color-text-main)] font-medium leading-relaxed max-w-4xl italic">
                                    "{data.items[activeIndex]?.quote}"
                                </p>

                                <div className="flex flex-col items-center space-y-4">
                                    <div className="size-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <img
                                            src={data.items[activeIndex]?.image || `https://ui-avatars.com/api/?name=${data.items[activeIndex]?.name}&background=0F758D&color=ffffff`}
                                            alt={data.items[activeIndex]?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[var(--color-text-main)] text-lg uppercase tracking-wider">
                                            {data.items[activeIndex]?.name}
                                        </h4>
                                        <p className="text-[var(--color-primary)] font-black text-[10px] uppercase tracking-widest mt-1">
                                            {data.items[activeIndex]?.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Indicators */}
                    <div className="flex justify-center gap-3 mt-10">
                        {data.items.map((_: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`h-2 transition-all duration-300 rounded-full ${activeIndex === idx ? "w-12 bg-[var(--color-primary)]" : "w-4 bg-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

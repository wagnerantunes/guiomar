"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";

interface FAQProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function FAQ({ getSetting }: FAQProps) {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const content = getSetting("section_faq_content", SECTION_DEFAULTS.faq);

    return (
        <section id="faq" className="py-32 bg-background px-6 relative overflow-hidden transition-colors duration-500">
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        {content.title}
                    </h2>
                    <div className="w-12 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6">
                    {(content.items || SECTION_DEFAULTS.faq.items).map((f: any, i: number) => (
                        <div
                            key={i}
                            className="group"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                className={`w-full px-8 py-7 flex items-center justify-between text-left transition-all duration-500 rounded-[2rem] border ${activeFaq === i
                                    ? "bg-foreground text-background border-foreground shadow-2xl scale-[1.02]"
                                    : "bg-card border-border text-foreground hover:bg-card-muted hover:border-primary/30"
                                    }`}
                            >
                                <span className={`font-black text-lg transition-colors duration-300 ${activeFaq === i ? "text-background" : "group-hover:text-primary"}`}>
                                    {f.q}
                                </span>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${activeFaq === i ? "bg-primary text-primary-foreground rotate-180" : "bg-foreground/10 text-muted border border-border"
                                    }`}>
                                    <span className="material-symbols-outlined text-xl">
                                        expand_more
                                    </span>
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-10 py-8 text-base text-muted font-medium leading-relaxed">
                                            {f.r}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

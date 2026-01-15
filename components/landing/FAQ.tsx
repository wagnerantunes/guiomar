"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";

interface FAQProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function FAQ({ getSetting }: FAQProps) {
    const [activeFaq, setActiveFaq] = useState<number | null>(0);

    const content = getSetting("section_faq_content", SECTION_DEFAULTS.faq);
    const items = content.items || SECTION_DEFAULTS.faq.items;

    // Split items for visual balancing if needed, but simple list is fine for right col

    return (
        <div className="w-full relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-start">

                {/* LEFT COLUMN - WELCOMING HEADER & CTA */}
                <div className="lg:w-1/3 lg:sticky lg:top-32 space-y-8">
                    <div className="space-y-4">
                        <span className="type-badge text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            Suporte
                        </span>
                        <h2
                            className="font-black text-foreground tracking-tighter leading-[1.1]"
                            style={{ fontSize: "var(--section-title-size)" } as any}
                        >
                            {content.title}
                        </h2>
                        <p className="type-body text-xl text-muted-foreground">
                            Respondemos as dúvidas mais comuns para te ajudar a entender melhor nosso trabalho.
                        </p>
                    </div>

                    {/* Support Card */}
                    <div className="bg-card/50 backdrop-blur-md border border-border/50 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 text-primary"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
                                    <span className="material-symbols-outlined text-3xl">mark_chat_unread</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted uppercase tracking-widest">Ainda tem dúvidas?</p>
                                    <p className="text-lg font-black text-foreground">Fale com a gente</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                                Nossa equipe está pronta para explicar cada detalhe de forma personalizada.
                            </p>
                            <a
                                href="https://wa.me/5511994416024"
                                target="_blank"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
                            >
                                <span className="material-symbols-outlined text-lg">chat</span>
                                Chamar no WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - ACCORDION LIST */}
                <div className="lg:w-2/3 w-full space-y-4">
                    {items.map((f: any, i: number) => (
                        <div
                            key={i}
                            className={`group rounded-[2rem] transition-all duration-500 border ${activeFaq === i
                                ? "bg-card border-primary/20 shadow-2xl scale-[1.02]"
                                : "bg-card/30 hover:bg-card border-border/50 hover:border-border"
                                }`}
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                className="w-full px-8 py-6 flex items-start text-left gap-6"
                            >
                                <span className={`flex-1 text-lg font-bold transition-colors duration-300 ${activeFaq === i ? "text-primary" : "text-foreground group-hover:text-primary"
                                    }`}>
                                    {f.q}
                                </span>
                                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 border ${activeFaq === i
                                    ? "bg-primary text-primary-foreground rotate-45 border-primary"
                                    : "bg-muted/10 text-muted-foreground border-transparent group-hover:bg-primary/10 group-hover:text-primary"
                                    }`}>
                                    <span className="material-symbols-outlined text-xl">add</span>
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-8 pb-8 pt-0">
                                            <div className="h-px w-full bg-gradient-to-r from-border/50 to-transparent mb-6"></div>
                                            <RichText
                                                content={f.r}
                                                className="text-muted-foreground font-medium text-base leading-relaxed"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

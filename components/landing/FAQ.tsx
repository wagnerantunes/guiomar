"use client";

import React, { useState } from "react";

interface FAQProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function FAQ({ getSetting }: FAQProps) {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const defaultFaqs = [
        {
            q: "Como funciona a consultoria?",
            r: "Nossa consultoria começa com um diagnóstico detalhado para entender as necessidades específicas da sua empresa.",
        },
        {
            q: "Quais normas vocês atendem?",
            r: "Atendemos integralmente as normas NR-17 (Ergonomia) e NR-1 (Gerenciamento de Riscos), além de foco em riscos psicossociais.",
        },
        {
            q: "O suporte é contínuo?",
            r: "Sim, oferecemos planos de acompanhamento para garantir a sustentação das mudanças implementadas.",
        },
    ];

    const content = getSetting("section_faq_content", {
        title: "Dúvidas Frequentes",
        items: defaultFaqs
    });

    return (
        <section id="faq" className="py-24 bg-gray-50 px-6">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-black text-[#0d1b12] text-center mb-16">
                    {content.title}
                </h2>
                <div className="space-y-4">
                    {(content.items || defaultFaqs).map((f: any, i: number) => (
                        <div
                            key={i}
                            className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left group"
                            >
                                <span className="font-black text-[#0d1b12] group-hover:text-primary transition-colors">
                                    {f.q}
                                </span>
                                <span
                                    className={`material-symbols-outlined transition-transform duration-300 ${activeFaq === i ? "rotate-180 text-primary" : "text-gray-400"
                                        }`}
                                >
                                    expand_more
                                </span>
                            </button>
                            {activeFaq === i && (
                                <div className="px-8 pb-6 text-sm text-gray-500 border-t border-gray-50 pt-5">
                                    {f.r}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

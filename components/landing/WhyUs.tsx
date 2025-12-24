"use client";

import React from "react";

interface WhyUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function WhyUs({ getSetting }: WhyUsProps) {
    const defaultItems = [
        {
            t: "Evolução Constante",
            d: "Entregamos transformação real, não apenas papéis.",
        },
        {
            t: "Integração Total",
            d: "Razão e Emoção. Técnica e Humanização.",
        },
        {
            t: "Segurança Jurídica",
            d: "Compliance total com as normas NR-17 e NR-1.",
        },
    ];

    const content = getSetting("section_whyus_content", {
        title: "Por que a RenovaMente?",
        items: defaultItems
    });

    return (
        <section id="porque" className="py-24 bg-primary/5 px-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-black text-[#0d1b12] text-center mb-16">
                    {content.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(content.items || defaultItems).map((v: any, i: number) => (
                        <div
                            key={i}
                            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 text-center space-y-4"
                        >
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                                <span className="material-symbols-outlined font-bold">
                                    verified_user
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-[#0d1b12]">{v.t}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{v.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

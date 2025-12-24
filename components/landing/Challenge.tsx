"use client";

import React from "react";

interface ChallengeProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Challenge({ getSetting }: ChallengeProps) {
    const content = getSetting("section_desafio_content", {
        title: "O desafio das empresas hoje",
        description: "Exigências como NR-1 e NR-17, somadas ao aumento de riscos psicossociais, tornam essencial uma atuação estruturada e preventiva.",
        statValue: "+30%",
        statLabel: "de produtividade em ambientes saudáveis"
    });

    return (
        <section id="desafio" className="py-24 bg-[#0d1b12] text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-4xl font-black">{content.title}</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {content.description}
                    </p>
                </div>
                <div className="lg:col-span-4">
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center">
                        <span className="text-7xl font-black text-primary block">
                            {content.statValue}
                        </span>
                        <span className="text-xs font-bold text-gray-300 uppercase mt-4 block">
                            {content.statLabel}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import React from "react";

interface MethodologyProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Methodology({ getSetting }: MethodologyProps) {
    const defaultSteps = [
        {
            t: "Diagnóstico Integrado",
            d: "Análise 360 do seu cenário atual.",
        },
        {
            t: "Inventário de Riscos",
            d: "Identificação técnica de pontos críticos.",
        },
        {
            t: "Plano de Ação",
            d: "Definição estratégica de soluções.",
        },
        {
            t: "Implementação",
            d: "Execução acompanhada por especialistas.",
        },
        {
            t: "Monitoramento",
            d: "Avaliação contínua de resultados.",
        },
        {
            t: "Sustentação",
            d: "Consolidação de uma cultura saudável.",
        },
    ];

    const content = getSetting("section_metodologia_content", {
        title: "Metodologia RenovaMente",
        steps: defaultSteps
    });

    return (
        <section
            id="metodologia"
            className="py-24 px-6 bg-white overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-black text-[#0d1b12] text-center mb-20">
                    {content.title}
                </h2>
                <div className="relative space-y-12">
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2"></div>
                    {(content.steps || defaultSteps).map((m: any, i: number) => (
                        <div
                            key={i}
                            className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            <div className="flex-1 w-full lg:text-right">
                                {i % 2 === 0 && (
                                    <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                        <h4 className="text-xl font-black text-primary mb-2">
                                            0{i + 1}. {m.t}
                                        </h4>
                                        <p className="text-sm text-gray-500">{m.d}</p>
                                    </div>
                                )}
                            </div>
                            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-text-dark font-black z-20 border-4 border-white shadow-lg shrink-0">
                                {i + 1}
                            </div>
                            <div className="flex-1 w-full lg:text-left">
                                {i % 2 !== 0 && (
                                    <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                        <h4 className="text-xl font-black text-primary mb-2">
                                            0{i + 1}. {m.t}
                                        </h4>
                                        <p className="text-sm text-gray-500">{m.d}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

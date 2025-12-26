"use client";

import React from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";

interface AboutUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function AboutUs({ getSetting }: AboutUsProps) {
    const content = getSetting("section_sobre_content", SECTION_DEFAULTS.sobre);

    return (
        <section id="sobre" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="relative">
                    <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-3xl shadow-xl z-20 hidden md:block">
                        <span className="text-4xl font-black block text-text-dark tracking-tighter">
                            + DE {content.experience}
                        </span>
                        <span className="text-[10px] font-bold text-text-dark uppercase tracking-widest leading-none">
                            Anos de Experiência
                        </span>
                    </div>
                    <img
                        src={content.image}
                        className="rounded-[3rem] shadow-2xl w-full aspect-[4/3] object-cover relative z-10"
                        alt="Sobre"
                    />
                    <div className="absolute inset-0 bg-primary/20 rounded-[3rem] -rotate-3 -z-0"></div>
                </div>
                <div className="space-y-8">
                    <div className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Sobre Nós
                    </div>
                    <h2 className="text-4xl font-black text-[var(--color-text-main)]">
                        {content.title}
                    </h2>
                    {content.subtitle && (
                        <p className="text-lg text-[var(--color-primary)] font-bold italic">
                            {content.subtitle}
                        </p>
                    )}
                    <p className="text-gray-600 leading-relaxed text-lg font-medium">
                        {content.description}
                    </p>
                    <button
                        onClick={() => {
                            const el = document.getElementById("servicos");
                            el?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="bg-[var(--color-background-dark)] text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-[var(--color-primary)] transition-all uppercase tracking-widest inline-block shadow-lg"
                    >
                        {content.ctaText || "CONHEÇA NOSSOS SERVIÇOS"}
                    </button>
                </div>
            </div>
        </section>
    );
}

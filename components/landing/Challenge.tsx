"use client";

import React from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";

interface ChallengeProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Challenge({ getSetting }: ChallengeProps) {
    const content = getSetting("section_desafio_content", SECTION_DEFAULTS.desafio);

    return (
        <section id="desafio" className="py-24 px-6 bg-[var(--color-background-dark)] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--color-primary)]/5 blur-[120px] -z-0"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
                <div className="lg:col-span-8 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black leading-tight">
                        {content.title}
                    </h2>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed">
                        {content.description}
                    </p>
                    <div className="h-1.5 w-24 bg-[var(--color-primary)] rounded-full"></div>
                </div>
                <div className="lg:col-span-4">
                    <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] text-center backdrop-blur-sm">
                        <span className="text-8xl font-black text-[var(--color-primary)] block drop-shadow-2xl">
                            {content.statValue}
                        </span>
                        <span className="text-xs font-black text-white/40 uppercase mt-6 block tracking-[0.3em]">
                            {content.statLabel}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

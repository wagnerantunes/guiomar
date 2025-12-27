"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";

interface FounderProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Founder({ getSetting }: FounderProps) {
    const content = getSetting("section_guiomar_content", SECTION_DEFAULTS.guiomar);

    return (
        <section
            id="guiomar"
            className="py-32 px-6 bg-white overflow-hidden relative"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="order-2 lg:order-1 space-y-10">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Liderança</span>
                        <h2 className={`${content.titleSize || 'text-4xl'} md:text-6xl font-black text-[#09090b] leading-[1.1] tracking-tighter uppercase italic`}>
                            {content.title}
                        </h2>
                    </div>

                    <p className={`${content.subtitleSize || 'text-lg'} text-xl text-zinc-900 font-bold italic border-l-4 border-primary pl-6`}>
                        {content.subtitle}
                    </p>

                    <div className="relative">
                        <RichText
                            content={content.description}
                            className={`text-zinc-500 leading-relaxed ${content.bodySize || 'text-lg'} font-medium`}
                        />
                    </div>

                    <div className="flex gap-6 pt-4">
                        <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex-1 hover:border-primary/20 transition-colors group">
                            <span className="text-4xl font-black text-[#09090b] block mb-2 group-hover:text-primary transition-colors">{content.yearsExp || "15+"}</span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Anos de<br />Experiência</span>
                        </div>
                        <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex-1 hover:border-primary/20 transition-colors group">
                            <span className="text-4xl font-black text-[#09090b] block mb-2 group-hover:text-primary transition-colors">{content.projectsCount || "500+"}</span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Projetos<br />Entregues</span>
                        </div>
                    </div>
                </div>

                <div className="order-1 lg:order-2 flex justify-center">
                    <div className="relative group w-full max-w-md">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                        <img
                            src={content.image}
                            className="rounded-[3.5rem] shadow-2xl relative z-10 w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            alt="Guiomar Melo"
                        />
                        <div className="absolute inset-0 border border-white/10 rounded-[3.5rem] z-20 pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

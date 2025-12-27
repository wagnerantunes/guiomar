"use client";

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
            className="py-24 px-6 bg-white overflow-hidden relative"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 space-y-8">
                    <div className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Fundadora
                    </div>
                    <h2 className={`${content.titleSize || 'text-4xl'} font-black text-[var(--color-text-main)] leading-tight`}>
                        {content.title}
                    </h2>
                    <p className={`${content.subtitleSize || 'text-lg'} text-gray-500 font-bold italic`}>
                        {content.subtitle}
                    </p>
                    <RichText
                        content={content.description}
                        className={`text-gray-600 leading-relaxed ${content.bodySize || 'text-lg'} font-medium`}
                    />
                    <div className="flex gap-4 pt-4">
                        <div className="p-4 bg-[var(--color-background-light)]/50 rounded-2xl border border-gray-100 flex-1">
                            <span className="text-2xl font-black text-[var(--color-primary)] block">{content.yearsExp || "15+"}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Anos de Experiência</span>
                        </div>
                        <div className="p-4 bg-[var(--color-background-light)]/50 rounded-2xl border border-gray-100 flex-1">
                            <span className="text-2xl font-black text-[var(--color-primary)] block">{content.projectsCount || "500+"}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Projetos Entregues</span>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                    <div className="relative group">
                        <img
                            src={content.image}
                            className="rounded-[3rem] shadow-2xl relative z-10 w-full aspect-[4/5] object-cover"
                            alt="Guiomar Melo"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

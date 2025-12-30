"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";

interface AboutUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function AboutUs({ getSetting }: AboutUsProps) {
    const content = getSetting("section_sobre_content", SECTION_DEFAULTS.sobre);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full"></div>

                <div className="relative z-10">
                    <img
                        src={content.image}
                        className="rounded-[2.5rem] shadow-2xl w-full aspect-[4/5] object-cover"
                        alt="Sobre"
                    />

                    {/* Experience Badge */}
                    <div className="absolute -bottom-8 -right-8 bg-card backdrop-blur-xl p-10 rounded-3xl shadow-2xl z-20 border border-border group-hover:scale-105 transition-transform duration-500">
                        <span className="text-5xl font-black block text-primary tracking-tighter leading-none mb-2">
                            +{content.experience}
                        </span>
                        <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] leading-tight block">
                            ANOS DE<br />EXCELÊNCIA
                        </span>
                    </div>
                </div>

                <div className="absolute inset-0 border-2 border-primary/10 rounded-[2.5rem] translate-x-6 translate-y-6 -z-0 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-700"></div>
            </div>

            <div className="space-y-10">
                <div className="space-y-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Sobre Nós</span>
                    <h2
                        className="font-black text-foreground leading-[1.1] tracking-tighter uppercase italic"
                        style={{ fontSize: "var(--section-title-size)" } as any}
                    >
                        {content.title}
                    </h2>
                </div>

                {content.subtitle && (
                    <p
                        className="text-xl text-foreground font-bold italic border-l-4 border-primary pl-6"
                        style={{ fontSize: "var(--section-subtitle-size)" } as any}
                    >
                        {content.subtitle}
                    </p>
                )}

                <div className="relative" style={{ fontSize: "var(--section-body-size)" } as any}>
                    <RichText
                        content={content.description}
                        className="text-muted leading-relaxed font-medium"
                    />
                </div>

                <div className="pt-6">
                    <button
                        onClick={() => {
                            const el = document.getElementById("servicos");
                            el?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="group flex items-center gap-6"
                    >
                        <div className="bg-foreground text-background px-10 py-5 rounded-2xl font-black text-xs hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-widest shadow-xl shadow-black/10">
                            {content.ctaText || "CONHEÇA NOSSOS SERVIÇOS"}
                        </div>
                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-500">
                            <span className="material-symbols-outlined text-sm text-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}


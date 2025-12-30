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
        <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center"
        >
            <div className="order-2 lg:order-1 space-y-10">
                <div className="space-y-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Liderança</span>
                    <h2
                        className="font-black text-foreground leading-[1.1] tracking-tighter uppercase italic"
                        style={{ fontSize: "var(--section-title-size)" } as any}
                    >
                        {content.title}
                    </h2>
                </div>

                <p
                    className="text-foreground/90 font-bold italic border-l-4 border-primary pl-6"
                    style={{ fontSize: "var(--section-subtitle-size)" } as any}
                >
                    {content.subtitle}
                </p>

                <div
                    className="relative"
                    style={{ fontSize: "var(--section-body-size)" } as any}
                >
                    <RichText
                        content={content.description}
                        className="text-muted-foreground leading-relaxed font-medium"
                    />
                </div>

                <div className="flex gap-6 pt-4">
                    <div className="p-8 bg-muted/5 rounded-3xl border border-border flex-1 hover:border-primary/20 transition-colors group">
                        <span className="text-4xl font-black text-foreground block mb-2 group-hover:text-primary transition-colors">{content.yearsExp || "15+"}</span>
                        <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Anos de<br />Experiência</span>
                    </div>
                    <div className="p-8 bg-muted/5 rounded-3xl border border-border flex-1 hover:border-primary/20 transition-colors group">
                        <span className="text-4xl font-black text-foreground block mb-2 group-hover:text-primary transition-colors">{content.projectsCount || "500+"}</span>
                        <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Projetos<br />Entregues</span>
                    </div>
                </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative group w-full max-w-md">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                    <img
                        src={content.image}
                        className="rounded-[2.5rem] shadow-2xl relative z-10 w-full aspect-[4/5] object-cover transition-all duration-700"
                        alt="Guiomar Melo"
                    />
                    <div className="absolute inset-0 border border-border rounded-[2.5rem] z-20 pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
}


"use client";

import React from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { InfiniteSlider } from "@/components/ui/InfiniteSlider";
import Image from "next/image";

interface ClientsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Clients({ getSetting }: ClientsProps) {
    const data = getSetting("section_clientes_content", SECTION_DEFAULTS.clientes);
    const items = data.items || SECTION_DEFAULTS.clientes.items;

    if (data.isVisible === false) return null;

    return (
        <section className="py-24 bg-background border-y border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-0 opacity-20 dark:opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] -z-0 opacity-10 dark:opacity-30"></div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mb-16">
                <span className="type-badge text-primary mb-4 block">Trust</span>
                <h2 className="type-h2 text-foreground">
                    {data.title}
                </h2>
                {data.subtitle && (
                    <p className="type-body text-sm mt-4 max-w-xl mx-auto italic border-t border-primary/10 pt-4 block">
                        {data.subtitle}
                    </p>
                )}
            </div>

            <div className="relative">
                <InfiniteSlider
                    items={items}
                    speed={30}
                    cardWidth="250px"
                    renderCard={(item: any, i: number) => (
                        <div key={i} className="px-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-700 opacity-40 hover:opacity-100 group">
                            {item.logo ? (
                                <div className="relative h-12 w-32 transition-transform group-hover:scale-110">
                                    <Image
                                        src={item.logo}
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                        sizes="128px"
                                    />
                                </div>
                            ) : (
                                <div className="h-12 flex items-center justify-center font-black text-muted/30 tracking-widest text-lg group-hover:text-primary/50">
                                    {item.name || `LOGO ${i + 1}`}
                                </div>
                            )}
                        </div>
                    )}
                />

                {/* Left/Right Overlays to fade out edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
            </div>

            {/* Divider Arrow */}
            <div className="flex justify-center mt-20 opacity-20">
                <div className="size-12 rounded-full border border-primary/30 flex items-center justify-center animate-bounce">
                    <span className="material-symbols-outlined text-xl text-primary">
                        keyboard_arrow_down
                    </span>
                </div>
            </div>
        </section>
    );
}

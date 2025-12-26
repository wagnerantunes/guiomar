"use client";

import React from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";

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
                    <h2 className="text-4xl font-black text-[#0d1b12]">
                        {content.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        {content.description}
                    </p>
                    <div className="bg-primary/5 p-10 rounded-[2.5rem] border-l-8 border-primary relative">
                        <span className="material-symbols-outlined absolute -top-4 right-8 text-primary opacity-20 text-7xl select-none">
                            format_quote
                        </span>
                        <p className="text-xl font-black text-[#0d1b12] italic leading-snug">
                            "{content.quote}"
                        </p>
                    </div>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-0 bg-primary rounded-[3rem] rotate-6 scale-95 opacity-50"></div>
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

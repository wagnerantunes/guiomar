"use client";

import React from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";

interface WhyUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function WhyUs({ getSetting }: { getSetting: any }) {
    const content = getSetting("section_porque_content", SECTION_DEFAULTS.porque);

    return (
        <section className="py-24 px-6 bg-[var(--color-background-light)]/40">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-[var(--color-text-main)]">
                        {content.title}
                    </h2>
                    <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(content.items || SECTION_DEFAULTS.porque.items).map((item: any, i: number) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="size-14 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center text-[var(--color-primary)] mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">done_all</span>
                            </div>
                            <h3 className="text-lg font-black text-[var(--color-text-main)] mb-3">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

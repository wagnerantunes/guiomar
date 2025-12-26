"use client";

import React, { useState } from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";

interface FAQProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function FAQ({ getSetting }: FAQProps) {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const content = getSetting("section_faq_content", SECTION_DEFAULTS.faq);

    return (
        <section id="faq" className="py-24 bg-[var(--color-background-light)]/20 px-6">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-black text-[var(--color-text-main)] text-center mb-16">
                    {content.title}
                </h2>
                <div className="space-y-4">
                    {(content.items || SECTION_DEFAULTS.faq.items).map((f: any, i: number) => (
                        <div
                            key={i}
                            className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left group"
                            >
                                <span className="font-black text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                                    {f.q}
                                </span>
                                <span
                                    className={`material-symbols-outlined transition-transform duration-300 ${activeFaq === i ? "rotate-180 text-[var(--color-primary)]" : "text-gray-400"
                                        }`}
                                >
                                    expand_more
                                </span>
                            </button>
                            {activeFaq === i && (
                                <div className="px-8 pb-6 text-sm text-gray-500 border-t border-gray-50 pt-5 font-medium leading-relaxed">
                                    {f.r}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";

interface WhyUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function WhyUs({ getSetting }: WhyUsProps) {
    const content = getSetting("section_porque_content", SECTION_DEFAULTS.porque);

    return (
        <section className="py-32 px-6 bg-zinc-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 space-y-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Diferenciais</span>
                    <h2 className="text-4xl md:text-6xl font-black text-[#09090b] tracking-tighter uppercase italic">
                        {content.title}
                    </h2>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(content.items || SECTION_DEFAULTS.porque.items).map((item: any, i: number) => (
                        <div
                            key={i}
                            className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

                            <div className="size-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#09090b] mb-8 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-sm">
                                <span className="material-symbols-outlined text-3xl">verified</span>
                            </div>

                            <h3 className="text-xl font-black text-[#09090b] mb-4 leading-tight">
                                {item.t}
                            </h3>

                            <RichText content={item.d} className="text-zinc-500 text-sm font-medium leading-relaxed prose-p:text-sm" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

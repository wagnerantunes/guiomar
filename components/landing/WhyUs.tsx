"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";

interface WhyUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function WhyUs({ getSetting }: WhyUsProps) {
    const content = getSetting("section_porque_content", SECTION_DEFAULTS.porque);

    return (
        <section className="py-32 px-6 bg-background relative overflow-hidden transition-colors duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full -z-0 opacity-50 dark:opacity-50 opacity-20 transition-opacity"></div>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 space-y-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Diferenciais</span>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic">
                        {content.title}
                    </h2>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(content.items || SECTION_DEFAULTS.porque.items).map((item: any, i: number) => (
                        <div
                            key={i}
                            className="bg-card p-10 rounded-[3rem] border border-border shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group relative overflow-hidden backdrop-blur-sm"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

                            <div className="size-16 bg-foreground/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm border border-border">
                                <span className="material-symbols-outlined text-3xl">verified</span>
                            </div>

                            <h3 className="text-xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                                {item.t}
                            </h3>

                            <RichText content={item.d} className="text-muted text-sm font-medium leading-relaxed prose-p:text-sm" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

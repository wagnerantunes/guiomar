"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { InfiniteSlider } from "@/components/ui/InfiniteSlider";

interface WhyUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function WhyUs({ getSetting }: WhyUsProps) {
    const content = getSetting("section_porque_content", SECTION_DEFAULTS.porque);
    let items = content.items || SECTION_DEFAULTS.porque.items;
    if (!Array.isArray(items)) items = [];
    const layout = content.layout || "grid";

    // Custom card renderer for slider mode
    const renderWhyUsCard = (item: any, index: number) => (
        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group relative overflow-hidden backdrop-blur-sm h-full">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

            <div className="size-16 bg-muted/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm border border-border">
                <span className="material-symbols-outlined text-3xl">verified</span>
            </div>

            <h3 className="text-xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                {item.t}
            </h3>

            <RichText
                content={item.d}
                className="text-muted font-medium leading-relaxed"
                style={{ fontSize: "var(--section-body-size)" } as any}
            />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 space-y-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Diferenciais</span>
                <h2
                    className="font-black text-foreground tracking-tighter uppercase italic"
                    style={{ fontSize: "var(--section-title-size)" } as any}
                >
                    {content.title}
                </h2>
                {content.subtitle && (
                    <p
                        className="text-muted font-bold uppercase tracking-widest max-w-2xl mx-auto"
                        style={{ fontSize: "var(--section-subtitle-size)" } as any}
                    >
                        {content.subtitle}
                    </p>
                )}
                <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
            </div>

            {layout === "slider" ? (
                <InfiniteSlider
                    items={items}
                    renderCard={renderWhyUsCard}
                    speed={30}
                    cardWidth="380px"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item: any, i: number) => (
                        <div
                            key={i}
                            className="bg-card p-10 rounded-[2.5rem] border border-border shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group relative overflow-hidden backdrop-blur-sm"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

                            <div className="size-16 bg-muted/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm border border-border">
                                <span className="material-symbols-outlined text-3xl">verified</span>
                            </div>

                            <h3 className="text-xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                                {item.t}
                            </h3>

                            <RichText
                                content={item.d}
                                className="text-muted font-medium leading-relaxed"
                                style={{ fontSize: "var(--section-body-size)" } as any}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


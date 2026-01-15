"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { motion } from "framer-motion";

interface WhyUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function WhyUs({ getSetting }: WhyUsProps) {
    const content = getSetting("section_porque_content", SECTION_DEFAULTS.porque);
    let items = content.items || SECTION_DEFAULTS.porque.items;
    if (!Array.isArray(items)) items = [];

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row gap-16 items-start">

                {/* HEADLINE COLUMN (Sticky on Desktop) */}
                <div className="md:w-1/3 md:sticky md:top-32 space-y-8">
                    <div className="space-y-4">
                        <span className="type-badge text-primary">Diferenciais</span>
                        <h2 className="type-h2 text-foreground">
                            {content.title}
                        </h2>
                        {content.subtitle && (
                            <p className="type-body text-xl font-medium text-muted-foreground border-l-2 border-primary pl-6">
                                {content.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Visual Image or Decorator */}
                    <div className="hidden md:block w-full aspect-square rounded-[3rem] relative overflow-hidden backdrop-blur-3xl border border-white/5 shadow-2xl">
                        {content.image ? (
                            <img 
                                src={content.image} 
                                alt={content.title || "RenovaMente"} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"></div>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/30 blur-[80px] rounded-full"></div>
                                <div className="absolute top-12 left-12 w-32 h-32 bg-secondary/30 blur-[40px] rounded-full"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-9xl text-primary/20">diamond</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ITEMS COLUMN (Scrollable List) */}
                <div className="md:w-2/3 w-full">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-6"
                    >
                        {items.map((item: any, i: number) => (
                            <motion.div
                                key={i}
                                variants={itemVariant}
                                className="group relative bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 rounded-3xl p-8 backdrop-blur-md transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:translate-x-2"
                            >
                                <div className="flex gap-6 items-start">
                                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                                        <span className="material-symbols-outlined text-2xl text-primary">{item.icon || "verified"}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="type-h3 text-xl">{item.t}</h3>
                                        <RichText
                                            content={item.d}
                                            className="type-body text-base text-muted-foreground"
                                        />
                                    </div>
                                </div>
                                {/* Glow Effect on Hover */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

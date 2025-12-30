"use client";

import React from "react";
import { motion } from "framer-motion";

interface InfiniteSliderProps {
    items: any[];
    renderCard?: (item: any, index: number) => React.ReactNode;
    speed?: number;
    cardWidth?: string;
    gap?: string;
}

export function InfiniteSlider({
    items,
    renderCard,
    speed = 30,
    cardWidth = "400px",
    gap = "2rem"
}: InfiniteSliderProps) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-20 text-muted">
                <p>Nenhum item para exibir</p>
            </div>
        );
    }

    // Duplicate items for seamless infinite loop
    const duplicatedItems = [...items, ...items];

    // Calculate animation distance based on number of items and card width
    // Parse cardWidth (e.g., "400px" -> 400) and gap (e.g., "2rem" -> 32px assuming 1rem = 16px)
    const cardWidthNum = parseInt(cardWidth);
    const gapNum = gap.includes("rem") ? parseInt(gap) * 16 : parseInt(gap);
    const totalWidth = items.length * (cardWidthNum + gapNum);

    return (
        <div className="px-6">
            <div
                className="relative overflow-hidden"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                }}
            >
                <motion.div
                    className="flex"
                    style={{ gap }}
                    animate={{
                        x: [0, -totalWidth],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: speed,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedItems.map((item, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0"
                            style={{ width: cardWidth }}
                        >
                            {renderCard ? renderCard(item, i) : (
                                <DefaultCard item={item} />
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

// Default card component if no custom renderer is provided
function DefaultCard({ item }: { item: any }) {
    return (
        <div className="bg-card backdrop-blur-xl p-10 rounded-[2.5rem] border border-border shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>

            {item.icon && (
                <div className="size-16 bg-muted/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm border border-border">
                    <span className="material-symbols-outlined text-3xl">{item.icon || "verified"}</span>
                </div>
            )}

            <h3 className="text-xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                {item.t || item.title || item.name}
            </h3>

            {(item.d || item.description) && (
                <div className="text-muted text-sm font-medium leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: item.d || item.description }} />
                </div>
            )}
        </div>
    );
}

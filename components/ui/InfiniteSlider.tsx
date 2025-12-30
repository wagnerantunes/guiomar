"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

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
    const [isPaused, setIsPaused] = useState(false);
    const controls = useAnimation();

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-20 text-muted">
                <p>Nenhum item para exibir</p>
            </div>
        );
    }

    // Duplicate items for seamless infinite loop
    const duplicatedItems = [...items, ...items, ...items];

    // Calculate animation distance
    const cardWidthNum = parseInt(cardWidth);
    const gapNum = gap.includes("rem") ? parseInt(gap) * 16 : parseInt(gap);
    const totalWidth = items.length * (cardWidthNum + gapNum);

    // Start animation on mount
    useEffect(() => {
        controls.start({
            x: [0, -totalWidth],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: speed,
                    ease: "linear",
                },
            },
        });
    }, [controls, totalWidth, speed]);

    const handlePause = () => {
        setIsPaused(true);
        controls.stop();
    };

    const handlePlay = () => {
        setIsPaused(false);
        controls.start({
            x: [0, -totalWidth],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: speed,
                    ease: "linear",
                },
            },
        });
    };

    const handlePrev = () => {
        controls.start({
            x: `+=${cardWidthNum + gapNum}`,
            transition: { duration: 0.5, ease: "easeOut" }
        });
    };

    const handleNext = () => {
        controls.start({
            x: `-=${cardWidthNum + gapNum}`,
            transition: { duration: 0.5, ease: "easeOut" }
        });
    };

    return (
        <div className="relative w-full -mx-6 px-6 group">
            {/* Navigation Controls */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none">
                <button
                    onClick={handlePrev}
                    className="size-12 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-auto"
                    aria-label="Anterior"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                    onClick={handleNext}
                    className="size-12 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-auto"
                    aria-label="Próximo"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Play/Pause Control */}
            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={isPaused ? handlePlay : handlePause}
                    className="size-10 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-xl flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    aria-label={isPaused ? "Play" : "Pause"}
                >
                    <span className="material-symbols-outlined text-lg">
                        {isPaused ? "play_arrow" : "pause"}
                    </span>
                </button>
            </div>

            <div
                className="relative overflow-hidden"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                }}
                onMouseEnter={handlePause}
                onMouseLeave={handlePlay}
            >
                <motion.div
                    className="flex"
                    style={{ gap }}
                    animate={controls}
                >
                    {duplicatedItems.map((item, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0"
                            style={{ width: cardWidth }}
                        >
                            {renderCard ? renderCard(item, i % items.length) : (
                                <DefaultCard item={item} />
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

// Default card component
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

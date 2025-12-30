"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AntigravityParticles } from "./AntigravityParticles";
import { ScrollIndicator } from "./ScrollIndicator";

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    stagger?: boolean;
    id?: string;
    nextId?: string; // ID of the next section to scroll to
    content?: any; // New prop for CMS content
    variant?: "default" | "muted" | "card";
}

export function SectionWrapper({
    children,
    className = "",
    delay = 0,
    stagger = false,
    id,
    nextId,
    content,
    variant = "default"
}: SectionWrapperProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const getFontSize = (val: any, fallback: number) => {
        if (!val) return fallback;
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.startsWith('text-')) {
            const mapping: any = {
                'text-sm': 14, 'text-base': 16, 'text-lg': 18, 'text-xl': 20,
                'text-2xl': 24, 'text-3xl': 30, 'text-4xl': 36, 'text-5xl': 48,
                'text-6xl': 60, 'text-7xl': 72
            };
            return mapping[val] || fallback;
        }
        const num = parseInt(val);
        return isNaN(num) ? fallback : num;
    };

    const titleSize = getFontSize(content?.titleSize, 48);
    const titleSizeMobile = getFontSize(content?.titleSizeMobile, 32);
    const subtitleSize = getFontSize(content?.subtitleSize, 20);
    const subtitleSizeMobile = getFontSize(content?.subtitleSizeMobile, 16);
    const bodySize = getFontSize(content?.bodySize, 18);
    const bodySizeMobile = getFontSize(content?.bodySizeMobile, 14);

    // Handle Visibility
    if (content?.isVisible === false) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger ? 0.2 : 0,
                delayChildren: delay,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98] as any
            }
        }
    };

    const bgOpacity = (content?.bgOpacity ?? 100) / 100;

    const variantClasses = {
        default: "bg-background",
        muted: "bg-muted/5",
        card: "bg-card"
    };

    return (
        <motion.section
            id={id}
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`py-32 px-6 ${variantClasses[variant]} ${className} relative overflow-hidden transition-colors duration-500`}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                #${id} {
                    --section-title-size: ${titleSizeMobile}px;
                    --section-subtitle-size: ${subtitleSizeMobile}px;
                    --section-body-size: ${bodySizeMobile}px;
                }
                @media (min-width: 768px) {
                    #${id} {
                        --section-title-size: ${titleSize}px;
                        --section-subtitle-size: ${subtitleSize}px;
                        --section-body-size: ${bodySize}px;
                    }
                }
            ` }} />
            {/* Background Image */}
            {content?.bgImage && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${content.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: bgOpacity
                    }}
                />
            )}

            {/* Antigravity Particles */}
            {content?.bgEffect === "particles" && <AntigravityParticles />}

            {/* Parallax Effect / Gradient fallback */}
            {content?.bgEffect === "parallax" && (
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0 animate-pulse pointer-events-none" />
            )}

            {/* Ambient Background Glow for variants */}
            {variant === "default" && (
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/2 blur-[120px] rounded-full opacity-20 pointer-events-none" />
            )}

            <div className="max-w-7xl mx-auto relative z-10 h-full w-full">
                {stagger ? (
                    React.Children.map(children, (child) => (
                        <motion.div variants={itemVariants}>
                            {child}
                        </motion.div>
                    ))
                ) : (
                    <motion.div variants={itemVariants}>
                        {children}
                    </motion.div>
                )}
            </div>

            {nextId && <ScrollIndicator targetId={nextId} />}
        </motion.section>
    );
}


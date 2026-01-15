"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AntigravityParticles } from "./AntigravityParticles";
import { ScrollIndicator } from "./ScrollIndicator";
import { AuroraBackground } from "./AuroraBackground";
import { AnimatedGrid } from "./AnimatedGrid";
import { useIsMobile } from "@/hooks/useMediaQuery";

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
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const isMobile = useIsMobile();

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
                staggerChildren: stagger ? (isMobile ? 0.1 : 0.2) : 0,
                delayChildren: delay,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: isMobile ? 15 : 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: isMobile ? 0.5 : 0.8,
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

    // Dynamic Style Overrides
    const styleVars = {
        ...(content?.bgColor && { '--background': content.bgColor }),
        ...(content?.primaryColor && { '--primary': content.primaryColor }),
        ...(content?.primaryColor && { '--color-primary': content.primaryColor }),
        // Granular Text Colors
        ...(content?.titleColor && { '--section-title-color': content.titleColor }),
        ...(content?.subtitleColor && { '--section-subtitle-color': content.subtitleColor }),
        ...(content?.bodyColor && { '--section-body-color': content.bodyColor }),
        // Fallback for generic text color
        ...(content?.textColor && { '--foreground': content.textColor }),

        ...(content?.paddingTop && { paddingTop: `${(isMobile ? content.paddingTop * 0.7 : content.paddingTop) || 0}px` }),
        ...(content?.paddingBottom && { paddingBottom: `${(isMobile ? content.paddingBottom * 0.7 : content.paddingBottom) || 0}px` }),
    } as React.CSSProperties;

    return (
        <motion.section
            id={id}
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`py-20 md:py-32 px-6 ${!content?.bgColor ? variantClasses[variant] : ''} ${className} relative overflow-hidden transition-colors duration-500 will-change-transform`}
            style={styleVars}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                #${id} {
                    --section-title-size: ${titleSizeMobile * (content?.fontScale || 1)}px;
                    --section-subtitle-size: ${subtitleSizeMobile * (content?.fontScale || 1)}px;
                    --section-body-size: ${bodySizeMobile}px;
                }
                /* Apply Specific Colors if they are set */
                #${id} .type-h1, #${id} .type-h2, #${id} .type-h3, #${id} h1, #${id} h2, #${id} h3 {
                    ${content?.titleColor ? 'color: var(--section-title-color) !important;' : ''}
                }
                #${id} .type-badge, #${id} .subtitle {
                    ${content?.subtitleColor ? 'color: var(--section-subtitle-color) !important;' : ''}
                }
                 #${id} .type-body, #${id} p, #${id} .prose {
                    ${content?.bodyColor ? 'color: var(--section-body-color) !important;' : ''}
                }

                @media (min-width: 768px) {
                    #${id} {
                        --section-title-size: ${titleSize * (content?.fontScale || 1)}px;
                        --section-subtitle-size: ${subtitleSize * (content?.fontScale || 1)}px;
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

            {/* Background Effects - Heavily optimized/disabled for mobile */}
            {!isMobile && (
                <>
                    {content?.bgEffect === "particles" && <AntigravityParticles />}
                    {content?.bgEffect === "aurora" && <AuroraBackground />}
                    {content?.bgEffect === "grid" && <AnimatedGrid />}
                </>
            )}

            {/* Parallax Effect / Gradient fallback - Only if not too heavy */}
            {content?.bgEffect === "parallax" && (
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0 animate-pulse pointer-events-none" />
            )}

            {/* Ambient Background Glow - Reduced blur for mobile */}
            {variant === "default" && (
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-primary/2 ${isMobile ? 'blur-[60px]' : 'blur-[120px]'} rounded-full opacity-20 pointer-events-none`} />
            )}

            <div className={`${content?.fullWidth ? "w-full px-6" : "max-w-7xl mx-auto"} ${content?.fullHeight ? "min-h-[60vh] flex flex-col justify-center" : "h-full"} relative z-10 w-full`}>
                {stagger ? (
                    React.Children.map(children, (child) => (
                        <motion.div variants={itemVariants} className="will-change-[transform,opacity]">
                            {child}
                        </motion.div>
                    ))
                ) : (
                    <motion.div variants={itemVariants} className="will-change-[transform,opacity]">
                        {children}
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}



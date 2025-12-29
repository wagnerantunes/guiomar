"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AntigravityParticles } from "./AntigravityParticles";

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    stagger?: boolean;
    id?: string;
    content?: any; // New prop for CMS content
}

export function SectionWrapper({
    children,
    className = "",
    delay = 0,
    stagger = false,
    id,
    content
}: SectionWrapperProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Handle Visiblity
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

    return (
        <motion.section
            id={id}
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`${className} relative overflow-hidden bg-background`}
        >
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

            {/* Parallax Effect (Simplificado para este contexto) */}
            {content?.bgEffect === "parallax" && (
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0 animate-pulse pointer-events-none" />
            )}

            <div className="relative z-10 h-full w-full">
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
        </motion.section>
    );
}

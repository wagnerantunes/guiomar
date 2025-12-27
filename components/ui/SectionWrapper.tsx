"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    stagger?: boolean;
    id?: string;
}

export function SectionWrapper({
    children,
    className = "",
    delay = 0,
    stagger = false,
    id
}: SectionWrapperProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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

    const isDark = id === "desafio" || id === "contato";

    return (
        <motion.section
            id={id}
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`${className} relative overflow-hidden ${isDark ? "bg-grid-dark" : "bg-grid-white"}`}
        >
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
        </motion.section>
    );
}

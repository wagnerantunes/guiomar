"use client";

import React from "react";
import { motion } from "framer-motion";

export function ScrollIndicator({ targetId = "sobre" }: { targetId?: string }) {
    const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            onClick={scrollToTarget}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group z-20"
        >
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-primary transition-colors duration-300">
                DESCUBRA
            </span>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1 group-hover:border-primary/50 transition-colors duration-300">
                <motion.div
                    animate={{
                        y: [0, 12, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-1 h-2 bg-primary rounded-full"
                />
            </div>
        </motion.button>
    );
}

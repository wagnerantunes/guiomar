"use client";

import React from "react";
import { motion } from "framer-motion";

export function FloatingOrbs() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] select-none">
            {/* Soft Ambient Light Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square bg-[#13ec5b]/5 rounded-full blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 120, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2,
                }}
                className="absolute top-[40%] -right-[10%] w-[35%] aspect-square bg-blue-500/5 rounded-full blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [0, 60, 0],
                    y: [0, -60, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5,
                }}
                className="absolute -bottom-[10%] left-[20%] w-[30%] aspect-square bg-purple-500/5 rounded-full blur-[120px]"
            />
        </div>
    );
}

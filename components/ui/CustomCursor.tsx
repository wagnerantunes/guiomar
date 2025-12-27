"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
    const [isPointer, setIsPointer] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === "pointer" ||
                target.tagName === "BUTTON" ||
                target.tagName === "A"
            );
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [cursorX, cursorY]);

    return (
        <>
            <motion.div
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                }}
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#13ec5b] pointer-events-none z-[9999] mix-blend-difference hidden md:block"
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    backgroundColor: isPointer ? "rgba(19, 236, 91, 0.1)" : "transparent",
                }}
            />
            <motion.div
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                }}
                className="fixed top-3 left-3 w-2 h-2 rounded-full bg-[#13ec5b] pointer-events-none z-[9999] hidden md:block"
            />
        </>
    );
}

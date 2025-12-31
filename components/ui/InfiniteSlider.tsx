"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useTransform,
    useSpring,
    useMotionValueEvent,
    PanInfo,
    animate
} from "framer-motion";

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
    speed = 30, // speed in pixels per second (approx)
    cardWidth = "400px",
    gap = "2rem"
}: InfiniteSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Safety check
    if (!Array.isArray(items) || items.length === 0) return null;

    // We quadruple items to ensure enough buffer for infinite looping
    // (original + clone + clone + clone)
    const duplicatedItems = [...items, ...items, ...items, ...items];

    // Numeric calculations
    const cardWidthNum = parseInt(cardWidth);
    const gapNum = gap.includes("rem") ? parseInt(gap) * 16 : parseInt(gap);
    const itemFullWidth = cardWidthNum + gapNum;
    const totalWidth = items.length * itemFullWidth; // Width of ONE set of items

    // Motion Values
    const x = useMotionValue(0);

    // We use a ref to track the "base" x position (without looping modulus)
    // to allow continuous movement including drag
    const baseX = useRef(0);

    // Speed Control
    // We can pause/resume by setting this multiplier to 0 or 1
    const autoScrollEnabled = !isHovered && !isDragging;

    // useAnimationFrame for smooth auto-scroll
    useAnimationFrame((time, delta) => {
        if (!autoScrollEnabled) return;

        // Move left based on speed
        // speed is px/second. delta is ms.
        // move = (speed * delta) / 1000
        const moveBy = (speed * delta) / 1000;

        baseX.current -= moveBy;

        // Wrap logic: Standard infinite loop
        // We render 4 sets. We move freely.
        // Visual trick: wrap baseX so it stays within [-totalWidth, 0]
        // But for smooth dragging, we just keep updating x
        // The wrapping happens in the `transform` or simply by resetting baseX when it gets too far.

        // "Infinite" reset:
        // If we have moved past the first set width (-totalWidth), add totalWidth to reset
        // If we moved right past 0, subtract totalWidth
        if (baseX.current <= -totalWidth) {
            baseX.current += totalWidth;
        } else if (baseX.current > 0) {
            baseX.current -= totalWidth;
        }

        x.set(baseX.current);
    });

    // Handle Drag
    const onDragStart = () => {
        setIsDragging(true);
    };

    const onDrag = (e: any, info: PanInfo) => {
        // Update baseX with drag delta
        baseX.current += info.delta.x;
        x.set(baseX.current);
    };

    const onDragEnd = (e: any, info: PanInfo) => {
        setIsDragging(false);
        // Optional: add inertia here if desired, but simple resume is fine/safer for "infinite" seam
        // If we want inertia, we'd need to animate baseX.current
    };

    // Responsive wrap for the display X
    // We want the visual X to always look correct even if baseX jumps.
    // Actually, simply setting x directly works if we jump baseX by exactly totalWidth.
    // Framer Motion handles the jump instantly without animation if we set() it inside the frame loop.

    return (
        <div
            className="w-screen ml-[calc(50%-50vw)] overflow-hidden cursor-grab active:cursor-grabbing relative"
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="flex py-8 pl-4"
                style={{ x, gap }}
                drag="x"
                dragConstraints={{ left: -100000, right: 100000 }} // Free drag essentially, we handle constraints manually if needed, but for infinite we just loop
                dragElastic={0.05} // low elasticity to feel "heavy"
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                whileTap={{ scale: 0.98 }}
            >
                {duplicatedItems.map((item, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0"
                        style={{ width: cardWidth }}
                    >
                        {renderCard ? renderCard(item, i % items.length) : (
                            <div className="bg-card p-8 rounded-xl border">Card {i}</div>
                        )}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

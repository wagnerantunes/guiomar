"use client";

import React from "react";

export const AnimatedGrid = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 perspective-[500px]">
            <div className="absolute inset-0 bg-background transition-colors duration-500" />
            <div className="moving-grid absolute inset-[-100%] w-[300%] h-[300%] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 dark:opacity-40" />

            <style jsx>{`
                .moving-grid {
                    transform: rotateX(45deg);
                    animation: gridMove 20s linear infinite;
                }
                
                @keyframes gridMove {
                    0% {
                        transform: rotateX(45deg) translateY(0);
                    }
                    100% {
                        transform: rotateX(45deg) translateY(40px);
                    }
                }
            `}</style>
        </div>
    );
};

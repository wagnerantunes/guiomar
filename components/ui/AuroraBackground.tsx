"use client";

import React from "react";
import { motion } from "framer-motion";

export const AuroraBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-background transition-colors duration-500" />
            <div className="absolute inset-0 aurora-gradient opacity-30 dark:opacity-50" />
            <style jsx>{`
                .aurora-gradient {
                    background-image: 
                        radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                        radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
                        radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
                    filter: blur(80px);
                    animation: aurora 20s infinite alternate;
                }
                @keyframes aurora {
                    0% {
                        background-position: 50% 50%, 50% 50%, 50% 50%;
                    }
                    100% {
                        background-position: 80% 0%, 20% 0%, 50% 100%;
                    }
                }
            `}</style>
        </div>
    );
};

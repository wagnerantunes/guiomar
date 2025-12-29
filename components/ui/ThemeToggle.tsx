"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-0 animate-pulse" />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="group relative w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 shadow-sm"
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5 overflow-hidden">
                <span
                    className={`material-symbols-outlined absolute inset-0 text-[20px] transition-all duration-500 transform ${isDark ? "translate-y-0 opacity-100 rotate-0" : "-translate-y-10 opacity-0 -rotate-90"
                        } text-primary`}
                >
                    dark_mode
                </span>
                <span
                    className={`material-symbols-outlined absolute inset-0 text-[20px] transition-all duration-500 transform ${!isDark ? "translate-y-0 opacity-100 rotate-0" : "translate-y-10 opacity-0 rotate-90"
                        } text-primary`}
                >
                    light_mode
                </span>
            </div>

            {/* Ambient Glow on Hover */}
            <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
        </button>
    );
}

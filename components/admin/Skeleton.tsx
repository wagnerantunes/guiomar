import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "rect" | "circle" | "text";
    style?: React.CSSProperties;
}

export function Skeleton({ className = "", variant = "rect", style }: SkeletonProps) {
    const baseClass = "relative overflow-hidden bg-gray-100 dark:bg-white/5";
    const variantClass = {
        rect: "rounded-2xl",
        circle: "rounded-full",
        text: "rounded-lg h-4 w-full"
    }[variant];

    return (
        <div
            className={`${baseClass} ${variantClass} ${className}`}
            aria-hidden="true"
            style={style}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
        </div>
    );
}

export function SkeletonGrid({ count = 3, className = "" }: { count?: number; className?: string }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#183221] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                    <Skeleton className="size-12 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24" variant="text" />
                        <Skeleton className="h-8 w-32" variant="text" />
                    </div>
                </div>
            ))}
        </div>
    );
}

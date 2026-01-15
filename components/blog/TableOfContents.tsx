"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0% 0% -80% 0%" }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    if (items.length === 0) return null;

    return (
        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary"></span>
                Conteúdo
            </h3>
            <nav className="flex flex-col gap-3">
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={cn(
                            "text-[11px] font-bold uppercase tracking-wider transition-all hover:text-primary leading-relaxed",
                            item.level === 3 ? "ml-4" : "",
                            activeId === item.id ? "text-primary translate-x-1" : "text-muted-foreground/70"
                        )}
                    >
                        {item.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}

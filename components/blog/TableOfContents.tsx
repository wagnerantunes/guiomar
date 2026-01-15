"use client";

import { useEffect, useState } from "react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
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
            { rootMargin: "0px 0px -80% 0px" }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [items]);

    if (items.length < 2) return null;

    return (
        <div className="bg-card border border-border rounded-3xl p-8 mb-8 shadow-sm">
            <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">toc</span>
                Neste Artigo
            </h3>
            <nav className="flex flex-col gap-1">
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.querySelector(`#${item.id}`)?.scrollIntoView({
                                behavior: "smooth",
                            });
                            setActiveId(item.id);
                        }}
                        className={`text-sm transition-colors py-1.5 border-l-2 pl-4 ${activeId === item.id
                            ? "border-primary text-primary font-bold"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            }`}
                        style={{
                            marginLeft: item.level === 3 ? "1rem" : "0",
                        }}
                    >
                        {item.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}

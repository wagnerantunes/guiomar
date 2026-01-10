"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ShareButtons({ title }: { title: string }) {
    const pathname = usePathname();
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    if (!url) return null;

    const links = [
        {
            icon: "send", // Using material symbol for "Share/Send" or specific brand if available in strings, but we use Material Symbols
            name: "WhatsApp",
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            color: "hover:text-[#25D366] hover:bg-[#25D366]/10",
        },
        {
            icon: "share", // Linkedin usually
            name: "LinkedIn",
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
            color: "hover:text-[#0077b5] hover:bg-[#0077b5]/10",
        },
        {
            icon: "public", // Facebook
            name: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "hover:text-[#1877F2] hover:bg-[#1877F2]/10",
        },
        {
            icon: "alternate_email", // X / Twitter
            name: "X (Twitter)",
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: "hover:text-white hover:bg-white/10",
        },
    ];

    return (
        <div className="flex flex-row md:flex-col gap-4 items-center bg-card border border-border p-4 rounded-2xl sticky top-32 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground writing-mode-vertical md:rotate-180 hidden md:block">
                Compartilhar
            </span>
            {links.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`size-10 flex items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 border border-transparent hover:border-border ${link.color}`}
                    title={`Compartilhar no ${link.name}`}
                >
                    {/* Note: In a real app we might use SVGs for brands. Using text/material for generic or fallback */}
                    {/* For specific brands using Material isn't ideal, but suffices if SVGs aren't handy. 
                        Let's try to map Material Symbols that look close or generic share icons. 
                      */}
                    {link.name === "WhatsApp" && <span className="font-bold">WA</span>}
                    {link.name === "LinkedIn" && <span className="font-bold">In</span>}
                    {link.name === "Facebook" && <span className="font-bold">Fb</span>}
                    {link.name === "X (Twitter)" && <span className="font-bold">X</span>}
                </a>
            ))}
        </div>
    );
}

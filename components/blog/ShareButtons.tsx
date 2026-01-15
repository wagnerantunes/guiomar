"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Check, Twitter, Facebook, Linkedin } from "lucide-react";

interface ShareButtonsProps {
    title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== "undefined" ? window.location.href : "";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // Simple alert replacement since sonner is not installed
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-5 right-5 bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl z-[200] animate-bounce';
        toast.innerText = 'Link Copiado!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    };

    const shareLinks = [
        { 
            name: "Twitter", 
            icon: Twitter, 
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` 
        },
        { 
            name: "LinkedIn", 
            icon: Linkedin, 
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` 
        },
        { 
            name: "Facebook", 
            icon: Facebook, 
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` 
        },
    ];

    return (
        <div className="flex xl:flex-col gap-3">
            <button
                onClick={copyToClipboard}
                className="size-12 rounded-2xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-all shadow-sm group"
                title="Copiar Link"
            >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="group-hover:scale-110 transition-transform" />}
            </button>
            
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-12 rounded-2xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-all shadow-sm group"
                    title={`Compartilhar no ${link.name}`}
                >
                    <link.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
            ))}
        </div>
    );
}

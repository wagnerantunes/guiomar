"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export function SearchWidget() {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary"></span>
                Pesquisar
            </h3>
            <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/20 scale-[1.02]' : ''}`}>
                <input
                    type="text"
                    placeholder="O que você procura?"
                    className="w-full bg-muted/30 border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-colors"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <Search size={16} className={`absolute left-4 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
        </div>
    );
}

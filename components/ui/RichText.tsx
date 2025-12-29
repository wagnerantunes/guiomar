"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RichTextProps {
    content: string;
    className?: string;
}

/**
 * Component to safely render HTML content from the CMS Tiptap editor.
 * Applies the .prose styles defined in globals.css.
 */
export function RichText({ content, className }: RichTextProps) {
    if (!content) return null;

    return (
        <div
            className={cn(
                "prose prose-lg max-w-none transition-colors duration-300",
                "prose-p:leading-relaxed prose-p:text-muted-foreground",
                "prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight",
                "prose-strong:text-foreground",
                "prose-a:text-primary hover:prose-a:opacity-80 prose-a:font-bold",
                "prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:mx-auto",
                className
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

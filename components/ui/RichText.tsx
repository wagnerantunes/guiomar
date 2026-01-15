import { cn } from "@/lib/utils";

interface RichTextProps {
    content: string;
    className?: string;
}

export function RichText({ content, className }: RichTextProps) {
    return (
        <div
            className={cn(
                "prose prose-neutral dark:prose-invert max-w-none",
                "prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground",
                "prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6",
                "prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4",
                "prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:mb-6",
                "prose-strong:text-foreground prose-strong:font-bold",
                "prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
                "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic",
                "prose-ul:list-disc prose-ul:pl-6 prose-li:text-muted-foreground prose-li:mb-2",
                "prose-img:rounded-3xl prose-img:border prose-img:border-border prose-img:shadow-lg",
                className
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

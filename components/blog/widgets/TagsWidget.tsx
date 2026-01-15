import Link from "next/link";
import { Tag } from "lucide-react";

interface TagData {
    id: string;
    name: string;
    slug: string;
}

interface TagsWidgetProps {
    tags: TagData[];
}

export function TagsWidget({ tags }: TagsWidgetProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary"></span>
                Tags Populares
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={`/blog?tag=${tag.slug}`}
                        className="px-4 py-2 bg-muted/50 border border-border rounded-xl text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all flex items-center gap-2"
                    >
                        <Tag size={10} />
                        {tag.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

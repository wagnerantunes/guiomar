import Link from "next/link";
import { Folder } from "lucide-react";

interface CategoriesWidgetProps {
    categories: any[];
}

export function CategoriesWidget({ categories }: CategoriesWidgetProps) {
    return (
        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary"></span>
                Categorias
            </h3>
            <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/blog/category/${cat.slug}`}
                        className="group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Folder size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
                                {cat.name}
                            </span>
                        </div>
                        <span className="bg-muted px-2 py-1 rounded-lg text-[9px] font-black text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all">
                            {cat._count.posts}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

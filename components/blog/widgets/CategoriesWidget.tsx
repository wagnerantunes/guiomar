interface Category {
    id: string;
    name: string;
    _count: {
        posts: number;
    };
}

interface CategoriesWidgetProps {
    categories: Category[];
}

export function CategoriesWidget({ categories }: CategoriesWidgetProps) {
    return (
        <div className="bg-card rounded-[2rem] p-8 border border-border relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-background/40 backdrop-blur-md -z-10"></div>
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-primary">category</span>
                Arquivos e Tópicos
            </h3>
            <ul className="space-y-3">
                {categories.map((category) => (
                    <li key={category.id}>
                        <a
                            className="group flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20"
                            href={`/blog/category/${category.id}`}
                        >
                            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                                {category.name}
                            </span>
                            <span className="bg-background text-[10px] font-black px-3 py-1 rounded-full text-muted-foreground shadow-sm border border-border group-hover:text-primary group-hover:border-primary/30">
                                {category._count.posts}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

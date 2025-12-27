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
        <div className="bg-white dark:bg-[#18181b]/40 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#13ec5b]">category</span>
                Arquivos e Tópicos
            </h3>
            <ul className="space-y-3">
                {categories.map((category) => (
                    <li key={category.id}>
                        <a
                            className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 hover:bg-[#13ec5b]/10 dark:hover:bg-[#13ec5b]/5 transition-all duration-300 border border-transparent hover:border-[#13ec5b]/20"
                            href={`/blog/category/${category.id}`}
                        >
                            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--color-text-main)] dark:text-gray-300 group-hover:text-[#13ec5b] transition-colors">
                                {category.name}
                            </span>
                            <span className="bg-white dark:bg-black/40 text-[10px] font-black px-3 py-1 rounded-full text-gray-400 dark:text-gray-500 shadow-sm border border-gray-100 dark:border-white/5 group-hover:text-[#13ec5b] group-hover:border-[#13ec5b]/30">
                                {category._count.posts}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

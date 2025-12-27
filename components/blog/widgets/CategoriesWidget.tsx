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
        <div className="bg-[#09090b] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md -z-10"></div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#13ec5b]">category</span>
                Arquivos e Tópicos
            </h3>
            <ul className="space-y-3">
                {categories.map((category) => (
                    <li key={category.id}>
                        <a
                            className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-[#13ec5b]/10 transition-all duration-300 border border-transparent hover:border-[#13ec5b]/20"
                            href={`/blog/category/${category.id}`}
                        >
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-300 group-hover:text-[#13ec5b] transition-colors">
                                {category.name}
                            </span>
                            <span className="bg-black/40 text-[10px] font-black px-3 py-1 rounded-full text-gray-500 shadow-sm border border-white/5 group-hover:text-[#13ec5b] group-hover:border-[#13ec5b]/30">
                                {category._count.posts}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

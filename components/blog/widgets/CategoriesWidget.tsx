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
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 bg-white">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">
                Categorias
            </h3>
            <ul className="flex flex-col gap-2">
                {categories.map((category) => (
                    <li key={category.id}>
                        <a
                            className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#e7f3eb] dark:hover:bg-[#1f422b]/50 transition-colors"
                            href={`/blog/category/${category.id}`}
                        >
                            <span className="text-text-main dark:text-gray-300 font-medium group-hover:text-primary">
                                {category.name}
                            </span>
                            <span className="bg-gray-100 dark:bg-black/40 text-xs font-bold px-2 py-1 rounded-full text-text-muted">
                                {category._count.posts}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

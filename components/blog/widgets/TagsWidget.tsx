export function TagsWidget() {
    const tags = [
        "Burnout",
        "Ergonomia",
        "Trabalho Remoto",
        "Gestão",
        "Sono",
        "Foco",
        "Liderança",
        "Saúde Mental",
    ];

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 bg-white">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">
                Tags
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <a
                        key={tag}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#1f422b]/30 text-xs font-bold text-text-muted hover:bg-primary hover:text-[#0d1b12] transition-colors"
                        href="#"
                    >
                        #{tag}
                    </a>
                ))}
            </div>
        </div>
    );
}

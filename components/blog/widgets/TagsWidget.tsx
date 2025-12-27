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
        <div className="bg-[#09090b] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md -z-10"></div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#13ec5b]">label</span>
                Explorar Tags
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <a
                        key={tag}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:bg-[#13ec5b] hover:text-[#0d1b12] hover:border-[#13ec5b] transition-all duration-300"
                        href="#"
                    >
                        #{tag}
                    </a>
                ))}
            </div>
        </div>
    );
}

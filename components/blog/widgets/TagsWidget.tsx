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
        <div className="bg-card rounded-[2rem] p-8 border border-border relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-background/40 backdrop-blur-md -z-10"></div>
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-primary">label</span>
                Explorar Tags
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <a
                        key={tag}
                        className="px-4 py-2 rounded-xl bg-muted/40 border border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                        href="#"
                    >
                        #{tag}
                    </a>
                ))}
            </div>
        </div>
    );
}

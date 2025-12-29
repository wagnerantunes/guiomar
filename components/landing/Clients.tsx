export function Clients() {
    return (
        <section className="py-20 bg-background border-y border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-0 opacity-20 dark:opacity-50"></div>
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-2xl font-bold text-muted mb-12 uppercase tracking-widest">
                    Empresas que confiam na RenovaMente
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
                    {/* Logos (Placeholders) */}
                    <div className="h-12 w-32 bg-card-muted rounded flex items-center justify-center font-bold text-muted-foreground">
                        LOGO 1
                    </div>
                    <div className="h-12 w-32 bg-card-muted rounded flex items-center justify-center font-bold text-muted-foreground">
                        LOGO 2
                    </div>
                    <div className="h-12 w-32 bg-card-muted rounded flex items-center justify-center font-bold text-muted-foreground">
                        LOGO 3
                    </div>
                    <div className="h-12 w-32 bg-card-muted rounded flex items-center justify-center font-bold text-muted-foreground">
                        LOGO 4
                    </div>
                    <div className="h-12 w-32 bg-card-muted rounded flex items-center justify-center font-bold text-muted-foreground">
                        LOGO 5
                    </div>
                    <div className="h-12 w-32 bg-card-muted rounded flex items-center justify-center font-bold text-muted-foreground">
                        LOGO 6
                    </div>
                </div>
            </div>
            {/* Divider Arrow */}
            <div className="flex justify-center mt-16 opacity-30">
                <span className="material-symbols-outlined text-3xl">
                    keyboard_arrow_down
                </span>
            </div>
        </section>
    );
}

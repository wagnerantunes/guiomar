export function About() {
    return (
        <section className="py-20 lg:py-28 bg-white relative" id="quem-somos">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image Area */}
                    <div className="relative order-2 lg:order-1">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-xl">
                            <img
                                className="w-full h-full object-cover"
                                alt="Team meeting in a modern office discussing strategy"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6lHeN9xCF7i1sfx7NuJmaHZHfFnNusCQJ9GZAkDAS5Ur7F-xC2XSp6JTdsbR8hVTqSE9ZTBTp8nROAZeESPhKa5RaSd3PHbfpLHRjgoV37zkO9gX2X8IK7C4cxQONxoueCmHHtYYnH7G3RKB2cgG5y2Podn4IxVeX-MRj912nNwxqIK1ljfmRtSlsoFyYpAr326rPes9IGgc8Z3pK_XZxilGVyd5J8XoXyz87AhvQtr52gB_u4aMVl_gb6NRm8nCJbTNPpzPrpQyM"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-3xl font-bold text-primary mb-1">
                                    + DE 30 ANOS
                                </p>
                                <p className="font-medium text-lg">DE EXPERIÊNCIA</p>
                            </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10"></div>
                    </div>
                    {/* Content Area */}
                    <div className="order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-text-muted uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Sobre Nós
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-text-main leading-tight">
                            Muito mais que uma consultoria comum
                        </h2>
                        <h3 className="text-xl text-primary font-medium">
                            A RenovaMente une ergonomia técnica e humanização para transformar
                            empresas
                        </h3>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                A RenovaMente atua na transformação de ambientes corporativos a
                                partir de uma abordagem integrada, que considera pessoas,
                                processos e exigências legais.
                            </p>
                            <p>
                                Nosso trabalho vai além do cumprimento de normas, promovendo
                                prevenção de riscos, fortalecimento da cultura organizacional e
                                ambientes mais saudáveis e produtivos.
                            </p>
                        </div>
                        <div className="pt-4">
                            <a
                                className="inline-flex items-center gap-2 font-bold text-text-main hover:text-primary transition-colors border-b-2 border-primary pb-1"
                                href="#servicos"
                            >
                                CONHEÇA NOSSOS SERVIÇOS
                                <span className="material-symbols-outlined text-sm">
                                    arrow_forward
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Divider Arrow */}
            <div className="flex justify-center mt-12 opacity-30">
                <span className="material-symbols-outlined text-3xl">
                    keyboard_arrow_down
                </span>
            </div>
        </section>
    );
}

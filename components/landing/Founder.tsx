export function Founder() {
    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    {/* Image */}
                    <div className="lg:col-span-5 relative">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                            {/* Placeholder for Guiomar Melo */}
                            <img
                                className="w-full h-full object-cover"
                                alt="Portrait of Guiomar Melo, founder of RenovaMente, smiling professionally"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr44Rwg47CLG4ksVHtF9Q1XO9K0sfCUdmQQ0QOaS385U8SXLv-3A22CbnWbng_42XdlSXIBM-Ne3CulqDLZ0zwkrDZ9TarT9brogbkGi_pdgeCBrPXYzbl9M81sr_gOjbdqp8Z0nAigRpuuVAXzFyGDQSC8nCC_sAbqTvzooHdq6c0yTF1cUmwVg7Syf1Z988ShL_xdQUZZEEjzoaazFnsf3g9J3usMvVUdjGFcK-oBB0Lym035v-9UO8S5_5VnHDdLWzqcLrbs3Cb"
                            />
                        </div>
                        {/* Decorative Frame */}
                        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary rounded-2xl -z-10"></div>
                    </div>
                    {/* Content */}
                    <div className="lg:col-span-7 space-y-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-text-main">
                            Sobre Guiomar Melo
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Guiomar Melo é Especialista em Bem-Estar Corporativo e fundadora
                            da RenovaMente. Sua atuação combina experiência em ambientes
                            corporativos, conhecimento técnico e uma abordagem humana,
                            apoiando empresas na construção de ambientes mais saudáveis,
                            conscientes e produtivos.
                        </p>
                        <div className="bg-primary/10 p-8 rounded-xl border-l-4 border-primary relative">
                            <span className="material-symbols-outlined absolute top-4 left-4 text-primary/30 text-6xl -z-10">
                                format_quote
                            </span>
                            <p className="text-xl font-medium text-text-main italic z-10 relative">
                                "Transformar ambientes de trabalho começa pelo cuidado genuíno
                                com as pessoas.”
                            </p>
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

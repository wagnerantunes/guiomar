export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-background-dark">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-background-dark/95 via-background-dark/80 to-primary/10 z-10"></div>
                <img
                    className="w-full h-full object-cover opacity-60"
                    alt="Modern corporate office environment with plants and natural light"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwsXDZ8mgtPr7RbZrfQ49hf7S1uNnFDHJk_CC6eWM0ObPSIQS0imuXls229umv5pemYV3BJ6cwUu6DlKblbSFXjWuFnkmHil3B4SJiTfU8zcaWvMF-fu2WPGv7NneZM-abjuIVoSRVgwJWWHrtJuwSYbHd7BoFjQaRxbEsqyMD4QYs8B9GShUParaDUMN_9Ggcb-_BiwX-xePV6IRTPK9J2cN-W7xzwu91s-rM17av1TunvYpzGRQZWzYBXsW3nihXAz88_MNTXass"
                />
            </div>
            <div className="layout-container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                {/* Text Content */}
                <div className="flex-1 text-white space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
                            Consciência que transforma{" "}
                            <span className="text-primary">ambientes de trabalho</span>
                        </h1>
                        <h2 className="text-xl text-gray-200 font-medium max-w-2xl leading-relaxed">
                            Consultoria em bem-estar corporativo que une técnica, cuidado e
                            gestão humana.
                        </h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg max-w-xl">
                        A RenovaMente é uma consultoria em bem-estar corporativo que atua
                        com ergonomia legal conforme NR-1 e NR-17, riscos psicossociais e
                        cultura organizacional, unindo técnica, conformidade e cuidado
                        humano para gerar resultados sustentáveis.
                    </p>
                    <div className="pt-2">
                        <a
                            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary hover:bg-primary-dark text-text-main font-bold text-base transition-colors shadow-lg shadow-primary/25"
                            href="#servicos"
                        >
                            NOSSOS SERVIÇOS
                        </a>
                    </div>
                </div>
                {/* Form Card */}
                <div className="w-full max-w-md lg:w-[420px] bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-primary">
                    <div className="p-8">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-text-main mb-2">
                                Transforme seu ambiente de trabalho
                            </h3>
                            <p className="text-sm text-gray-500">
                                Preencha os dados abaixo para iniciar.
                            </p>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 text-text-main"
                                    placeholder="Seu nome"
                                    type="text"
                                />
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 text-text-main"
                                    placeholder="Seu e-mail corporativo"
                                    type="email"
                                />
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 text-text-main"
                                    placeholder="Nome da empresa"
                                    type="text"
                                />
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 text-text-main"
                                    placeholder="WhatsApp - Telefone"
                                    type="tel"
                                />
                            </div>
                            <button
                                className="w-full bg-primary hover:bg-primary-dark text-text-main font-bold py-3.5 rounded-lg transition-colors shadow-md mt-2"
                                type="button"
                            >
                                Solicitar contato
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
                <span className="material-symbols-outlined text-4xl">
                    keyboard_arrow_down
                </span>
            </div>
        </section>
    );
}

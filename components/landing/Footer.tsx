import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-100 pt-20 pb-10 text-gray-600">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-primary rounded flex items-center justify-center text-text-main">
                                <span className="material-symbols-outlined">spa</span>
                            </div>
                            <h2 className="text-text-main text-xl font-bold tracking-tight">
                                RenovaMente
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Consultoria em bem-estar corporativo que une técnica, cuidado e
                            gestão humana para transformar ambientes de trabalho.
                        </p>
                        <div className="flex gap-4">
                            <a
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-text-main transition-colors shadow-sm"
                                href="#"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    photo_camera
                                </span>
                            </a>
                            <a
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-text-main transition-colors shadow-sm"
                                href="#"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    public
                                </span>
                            </a>
                            <a
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-text-main transition-colors shadow-sm"
                                href="#"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    work
                                </span>
                            </a>
                        </div>
                    </div>
                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-text-main mb-6 uppercase tracking-wider text-sm">
                            Quick Links
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="#quem-somos"
                                >
                                    Sobre Nós
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="#servicos"
                                >
                                    Nossos Serviços
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="#metodologia"
                                >
                                    Metodologia
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="/blog"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="hover:text-primary transition-colors"
                                    href="#contato"
                                >
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* Column 3: Services */}
                    <div>
                        <h3 className="font-bold text-text-main mb-6 uppercase tracking-wider text-sm">
                            Serviços
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Ergonomia Legal
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Clima Organizacional
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Cultura Organizacional
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Bem-Estar Corporativo
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Recrutamento
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Column 4: Newsletter */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-text-main mb-2">Receba novidades</h3>
                        <p className="text-xs mb-4">
                            Inscreva-se para receber dicas de bem-estar corporativo e
                            novidades da RenovaMente.
                        </p>
                        <form className="space-y-3">
                            <input
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Seu nome"
                                type="text"
                            />
                            <input
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Seu melhor e-mail*"
                                type="email"
                            />
                            <button
                                className="w-full bg-text-main text-white font-bold py-2 rounded hover:bg-gray-800 transition-colors text-sm"
                                type="button"
                            >
                                Inscrever-se
                            </button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-500">
                    <p>© 2023 RenovaMente. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

"use client";

import { useState } from "react";

export function Contact() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    source: "Landing Page Contact Form",
                }),
            });
            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", phone: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("error");
        }
    };

    return (
        <section
            className="py-20 lg:py-28 bg-background-dark relative overflow-hidden"
            id="contato"
        >
            {/* Abstract Background Pattern */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl pointer-events-none"></div>
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left Side: Info */}
                    <div className="text-white space-y-8">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Vamos conversar?
                            </h2>
                            <p className="text-lg text-gray-300">
                                Se sua empresa busca conformidade legal, prevenção de riscos e
                                ambientes de trabalho mais saudáveis, a RenovaMente pode ajudar.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-10 bg-primary rounded flex items-center justify-center text-text-main">
                                    <span className="material-symbols-outlined">spa</span>
                                </div>
                                <span className="font-bold text-xl">RenovaMente</span>
                            </div>
                            <p className="text-gray-300">
                                Tem alguma dúvida sobre nossa metodologia ou quer solicitar uma
                                proposta? Preencha o formulário ou nos chame no WhatsApp.
                            </p>
                            <div className="space-y-4 pt-2">
                                <a
                                    className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                                    href="https://wa.me/5511994416024"
                                >
                                    <span className="material-symbols-outlined text-primary">
                                        chat
                                    </span>
                                    (11) 99441-6024
                                </a>
                                <a
                                    className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors break-all"
                                    href="mailto:renova@renovamente-guiomarmelo.com.br"
                                >
                                    <span className="material-symbols-outlined text-primary">
                                        mail
                                    </span>
                                    renova@renovamente-guiomarmelo.com.br
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Right Side: Form */}
                    <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-2xl">
                        <h3 className="text-2xl font-bold text-text-main mb-6">
                            Solicite uma avaliação inicial
                        </h3>
                        {status === "success" ? (
                            <div className="bg-green-50 text-green-700 p-8 rounded-xl text-center">
                                <span className="material-symbols-outlined text-5xl mb-4">check_circle</span>
                                <h4 className="font-bold text-xl mb-2">Mensagem enviada!</h4>
                                <p>Obrigado pelo contato. Retornaremos em breve.</p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="mt-6 text-green-700 underline font-bold"
                                >
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-1 block">
                                        Nome Completo
                                    </span>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-text-main"
                                        placeholder="Seu nome"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-1 block">
                                        E-mail Corporativo
                                    </span>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-text-main"
                                        placeholder="seu@email.com"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-1 block">
                                        Telefone / WhatsApp
                                    </span>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-text-main"
                                        placeholder="(11) 9999-9999"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 mb-1 block">
                                        Como podemos ajudar?
                                    </span>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-text-main resize-none"
                                        placeholder="conte um pouco da sua empresa ou suas dúvidas..."
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </label>
                                {status === "error" && (
                                    <p className="text-red-500 text-sm font-bold">Ocorreu um erro ao enviar. Tente novamente.</p>
                                )}
                                <button
                                    className="w-full bg-primary hover:bg-primary-dark text-text-main font-bold py-4 rounded-lg transition-colors shadow-lg mt-2 disabled:opacity-50"
                                    type="submit"
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? "Enviando..." : "Enviar Mensagem"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}


import React, { useState } from "react";

interface HeroProps {
    getSetting: (key: string, defaultValue: any) => any;
    scrollTo: (id: string) => void;
}

export function Hero({ getSetting, scrollTo }: HeroProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            source: "Hero Section Lead Form",
            domain: window.location.hostname
        };

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <section
            id="hero"
            className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden"
        >
            <div className="absolute inset-0 z-0">
                <img
                    src={getSetting("section_hero_content", {}).image || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"}
                    className="w-full h-full object-cover"
                    alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#102216]/95 via-[#102216]/80 to-transparent"></div>
            </div>
            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-white space-y-8 animate-fadeInLeft">
                    <h1 className="text-4xl md:text-6xl font-black leading-[1.1]">
                        {getSetting("section_hero_content", { title: "Consciência que transforma ambientes de trabalho" }).title}
                    </h1>
                    <p className="text-lg md:text-xl font-bold text-primary italic">
                        {getSetting("section_hero_content", { description: "Técnica, cuidado e gestão humana para sua empresa." }).description}
                    </p>
                    <button
                        onClick={() => scrollTo("servicos")}
                        className="bg-primary text-text-dark px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        NOSSOS SERVIÇOS
                    </button>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl animate-fadeInRight max-w-md ml-auto">
                    <h3 className="text-2xl font-black mb-6 text-[#0d1b12]">
                        Fale com um especialista
                    </h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Nome"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-100 text-[#0d1b12] text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="E-mail Corporativo"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-100 text-[#0d1b12] text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-[#0d1b12] text-white py-4 rounded-xl font-black text-sm hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            {status === "loading" ? "Enviando..." :
                                status === "success" ? "Solicitação Enviada!" :
                                    status === "error" ? "Erro ao Enviar" : "Solicitar Contato"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}


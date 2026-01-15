"use client";

import React, { useState } from "react";
import { Footer } from "./Footer";
import { useToast } from "@/components/ui/ToastProvider";

interface GlobalFooterProps {
    settings?: any;
    logo?: string | null;
    logoLight?: string | null;
    logoDark?: string | null;
}

export function GlobalFooter(props: GlobalFooterProps) {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const { toast } = useToast();

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        
        setNewsletterStatus("loading");
        try {
            const res = await fetch("/api/newsletter/subscribers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newsletterEmail }),
            });
            
            if (res.ok) {
                setNewsletterStatus("success");
                setNewsletterEmail("");
                toast.success("Inscrição realizada!", {
                    description: "Você receberá nossas novidades em breve."
                });
                setTimeout(() => setNewsletterStatus("idle"), 2000);
            } else {
                setNewsletterStatus("error");
                toast.error("Erro na inscrição", {
                    description: "Por favor, tente novamente."
                });
                setTimeout(() => setNewsletterStatus("idle"), 3000);
            }
        } catch (error) {
            setNewsletterStatus("error");
            toast.error("Erro de conexão", {
                description: "Verifique sua internet e tente novamente."
            });
            setTimeout(() => setNewsletterStatus("idle"), 3000);
        }
    };

    return (
        <Footer
            {...props}
            newsletterEmail={newsletterEmail}
            setNewsletterEmail={setNewsletterEmail}
            handleNewsletterSubmit={handleNewsletterSubmit}
            newsletterStatus={newsletterStatus}
        />
    );
}

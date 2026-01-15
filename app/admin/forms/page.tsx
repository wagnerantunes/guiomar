"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";

interface FormField {
    id: string;
    label: string;
    type: "text" | "email" | "tel" | "textarea" | "select";
    required: boolean;
    options?: string[];
}

interface FormConfig {
    fields: FormField[];
    notificationEmail: string;
    successMessage: string;
    active: boolean;
}

export default function FormsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();
    const [formConfig, setFormConfig] = useState<FormConfig>({
        fields: [
            { id: "1", label: "Nome Completo", type: "text", required: true },
            { id: "2", label: "E-mail", type: "email", required: true },
            { id: "3", label: "Tipo de Interesse", type: "select", required: true, options: ["Suporte", "Vendas", "Parcerias"] },
            { id: "4", label: "Mensagem", type: "textarea", required: true },
        ],
        notificationEmail: "renova@renovamente-guiomarmelo.com.br",
        successMessage: "Obrigado por entrar em contato! Nossa equipe responderá em breve.",
        active: true,
    });

    useEffect(() => {
        async function fetchConfig() {
            try {
                const response = await fetch("/api/settings");
                const settings = await response.json();
                const config = settings.find((s: any) => s.key === "form_contact");
                if (config) {
                    setFormConfig(config.value);
                }
            } catch (error) {
                console.error("Error fetching form configuration:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchConfig();
    }, []);

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newFields = [...formConfig.fields];
        const draggedItem = newFields[draggedIndex];
        newFields.splice(draggedIndex, 1);
        newFields.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        setFormConfig({ ...formConfig, fields: newFields });
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "form_contact",
                    value: formConfig,
                }),
            });
            if (response.ok) {
                toast({
                    title: "Formulário Atualizado",
                    description: "As configurações foram aplicadas com sucesso.",
                    type: "success"
                });
            } else {
                toast({ title: "Erro ao Salvar", description: "Verifique o servidor e tente novamente.", type: "error" });
            }
        } catch (error) {
            console.error("Error saving form configuration:", error);
            toast({ title: "Falha na Rede", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const addField = () => {
        const newField: FormField = {
            id: Math.random().toString(36).substr(2, 9),
            label: "Novo Campo",
            type: "text",
            required: false,
        };
        setFormConfig({ ...formConfig, fields: [...formConfig.fields, newField] });
    };

    const removeField = (id: string) => {
        setFormConfig({
            ...formConfig,
            fields: formConfig.fields.filter((f) => f.id !== id),
        });
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFormConfig({
            ...formConfig,
            fields: formConfig.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        });
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-20">
                <div className="text-center space-y-6">
                    <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto shadow-[0_0_30px_rgba(var(--primary),0.2)]"></div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] animate-pulse">Carregando formulários...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full pb-20">
            {/* HEADER */}
            <div className="px-6 py-10 md:px-12 border-b border-border sticky top-0 bg-background/80 backdrop-blur-2xl z-20 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-[0.2em]">Gestão de Formulários</h1>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] mt-2">
                            Configure campos, fluxos de notificação e experiências de usuário.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-12 max-w-screen-2xl mx-auto w-full space-y-12">
                {/* FORM CARD */}
                <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] border border-border shadow-2xl relative overflow-hidden transition-all hover:border-primary/20 hover:shadow-primary/5">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]"></div>
                    <div className="p-10 md:p-14">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
                            <div className="flex items-center gap-6">
                                <div className="size-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.1)] border border-primary/20">
                                    <span className="material-symbols-outlined text-4xl">contact_mail</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <h3 className="font-black text-2xl text-foreground uppercase tracking-tight">Formulário de Contato</h3>
                                        <span
                                            role="status"
                                            className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest shadow-lg ${formConfig.active ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10' : 'bg-muted/10 text-muted border-muted/20'}`}>
                                            {formConfig.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em]">Interface Pública (/contato)</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            {/* FIELDS COLUMN */}
                            <div className="lg:col-span-7 space-y-10">
                                <div className="flex items-center justify-between pb-6 border-b border-border">
                                    <h4 className="font-black text-[10px] text-muted uppercase tracking-[0.3em]">Configuração de Campos</h4>
                                    <button
                                        aria-label="Adicionar novo campo ao formulário"
                                        onClick={addField}
                                        className="text-[9px] text-primary-foreground font-black uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center gap-2 px-6 py-3 bg-primary rounded-xl shadow-lg shadow-primary/20 active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        Novo Campo
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {formConfig.fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragEnd={handleDragEnd}
                                            className={`p-8 bg-muted/5 rounded-[2rem] border border-border group hover:border-primary/40 transition-all outline-none focus-within:ring-2 focus-within:ring-primary/50 ${draggedIndex === index ? 'opacity-50 scale-95 shadow-inner bg-background/40' : 'hover:bg-muted/[0.07]'}`}
                                        >
                                            <div className="flex flex-col gap-8">
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex items-center gap-6 flex-1">
                                                        <span className="material-symbols-outlined text-foreground/10 cursor-grab active:cursor-grabbing hover:text-primary transition-colors text-2xl">drag_indicator</span>
                                                        <div className="flex flex-col flex-1 space-y-2">
                                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Label do Campo</label>
                                                            <input
                                                                aria-label={`Rótulo do campo ${field.label}`}
                                                                className="bg-transparent border-none p-0 text-base font-black text-foreground focus:ring-0 w-full placeholder:text-muted/50 transition-colors"
                                                                value={field.label}
                                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                                placeholder="Digite o nome do campo..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        aria-label={`Remover campo ${field.label}`}
                                                        onClick={() => removeField(field.id)}
                                                        className="size-12 flex items-center justify-center rounded-2xl bg-muted/5 text-muted hover:text-foreground hover:bg-destructive/20 hover:border-destructive/50 border border-transparent transition-all active:scale-90"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[9px] font-black text-muted uppercase tracking-widest block ml-1">Tipo de Entrada</label>
                                                        <select
                                                            aria-label={`Tipo de entrada para o campo ${field.label}`}
                                                            className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none shadow-inner"
                                                            value={field.type}
                                                            onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                                        >
                                                            <option value="text">Texto Simples</option>
                                                            <option value="email">E-mail</option>
                                                            <option value="tel">Telefone</option>
                                                            <option value="textarea">Área de Texto (Múltiplas Linhas)</option>
                                                            <option value="select">Seleção (Dropdown)</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-end pb-1.5 ml-1">
                                                        <label className="flex items-center gap-4 cursor-pointer group/check select-none">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    aria-label={`Campo ${field.label} obrigatório`}
                                                                    checked={field.required}
                                                                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                                    className="size-6 rounded-lg border-2 border-border text-primary focus:ring-primary/20 transition-all checked:border-primary checked:bg-primary"
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-black text-muted group-hover/check:text-foreground uppercase tracking-widest transition-colors">Obrigatório</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {field.type === 'select' && (
                                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 pt-2 border-t border-border">
                                                        <label className="text-[9px] font-black text-muted uppercase tracking-widest block ml-1">Opções (Separadas por vírgula)</label>
                                                        <input
                                                            aria-label={`Opções para o campo de seleção ${field.label}`}
                                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-xs font-bold text-muted outline-none focus:border-primary/50 transition-all shadow-inner"
                                                            value={field.options?.join(", ") || ""}
                                                            onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(o => o.trim()) })}
                                                            placeholder="Ex: Comercial, Suporte, Parcerias..."
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SETTINGS COLUMN */}
                            <div className="lg:col-span-5 space-y-10">
                                <div className="bg-muted/20 rounded-[3rem] p-10 border border-border relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                                        <span className="material-symbols-outlined text-9xl text-foreground">settings</span>
                                    </div>
                                    <h4 className="font-black text-[10px] text-primary uppercase tracking-[0.3em] mb-10 pb-6 border-b border-primary/20">Notificação & Entrega</h4>
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Receber envios em:</label>
                                            <div className="relative group">
                                                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors text-xl">alternate_email</span>
                                                <input
                                                    aria-label="E-mail para notificações de novos envios"
                                                    className="w-full text-xs font-bold bg-background border border-border rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground shadow-inner placeholder:text-muted/50"
                                                    value={formConfig.notificationEmail}
                                                    onChange={(e) => setFormConfig({ ...formConfig, notificationEmail: e.target.value })}
                                                    placeholder="contato@empresa.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Mensagem de Sucesso</label>
                                            <textarea
                                                aria-label="Mensagem exibida após envio com sucesso"
                                                className="w-full text-xs font-medium bg-background border border-border rounded-[2rem] px-8 py-6 h-48 resize-none outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all leading-relaxed text-muted shadow-inner"
                                                value={formConfig.successMessage}
                                                onChange={(e) => setFormConfig({ ...formConfig, successMessage: e.target.value })}
                                                placeholder="Defina a mensagem que o usuário verá ao finalizar o envio..."
                                            />
                                        </div>
                                        <div className="pt-6">
                                            <label className="flex items-center gap-6 cursor-pointer p-8 bg-background/50 rounded-[2rem] border border-border hover:border-primary/50 transition-all shadow-lg group/toggle">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        aria-label="Habilitar ou desabilitar o formulário no site"
                                                        checked={formConfig.active}
                                                        onChange={(e) => setFormConfig({ ...formConfig, active: e.target.checked })}
                                                        className="size-8 rounded-xl border-2 border-border text-primary focus:ring-primary/20 checked:border-primary checked:bg-primary transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-black text-foreground uppercase tracking-widest group-hover/toggle:text-primary transition-colors">Habilitar no Site</p>
                                                    <p className="text-[9px] text-muted font-bold uppercase tracking-widest leading-none">Visibilidade pública do form</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
                            <p className="text-[9px] text-muted font-black uppercase tracking-widest max-w-xs text-center md:text-left">
                                As alterações entrarão em vigor imediatamente na interface pública do site.
                            </p>
                            <button
                                aria-label="Salvar todas as configurações do formulário"
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full md:w-auto px-16 py-6 text-[10px] font-black bg-primary text-primary-foreground rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(var(--primary),0.3)] hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(var(--primary),0.4)] transition-all uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <span className="flex items-center justify-center gap-4">
                                    {saving ? (
                                        <>
                                            <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">save</span>
                                            Publicar Alterações
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

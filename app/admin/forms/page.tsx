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
        notificationEmail: "contato@renovamente.com.br",
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
            <div className="flex-1 flex items-center justify-center bg-[#f6f8f6] dark:bg-[#102216]">
                <div className="text-center space-y-4">
                    <div className="size-12 border-4 border-[#13ec5b]/20 border-t-[#13ec5b] rounded-full animate-spin mx-auto"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carregando formulários...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full bg-[#f8faf8] dark:bg-[#0d1b12]">
            {/* HEADER */}
            <div className="px-6 py-8 md:px-10 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#0d1b12]/80 backdrop-blur-xl z-20 shrink-0 sticky top-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white uppercase tracking-[0.2em]">Gestão de Formulários</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                            Configure campos, fluxos de notificação e experiências de usuário.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-10">
                {/* FORM CARD */}
                <div className="bg-white dark:bg-[#183221]/40 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-[#13ec5b]/5">
                    <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#13ec5b]"></div>
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-[2rem] bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined text-3xl">contact_mail</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-4">
                                        <h3 className="font-black text-xl text-[#0d1b12] dark:text-white uppercase tracking-tight">Formulário de Contato</h3>
                                        <span
                                            role="status"
                                            className={`text-[9px] font-black px-4 py-1.5 rounded-full border-2 uppercase tracking-widest ${formConfig.active ? 'bg-[#13ec5b]/10 text-[#13ec5b] border-[#13ec5b]/20' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                            {formConfig.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em]">Interface Pública (/contato)</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* FIELDS COLUMN */}
                            <div className="lg:col-span-7 space-y-8">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                                    <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Configuração de Campos</h4>
                                    <button
                                        aria-label="Adicionar novo campo ao formulário"
                                        onClick={addField}
                                        className="text-[10px] text-[#13ec5b] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 px-4 py-2 bg-[#13ec5b]/5 rounded-xl"
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
                                            className={`p-6 md:p-8 bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] border border-gray-100/50 dark:border-white/5 group hover:border-[#13ec5b]/40 transition-all outline-none focus-within:ring-4 focus-within:ring-[#13ec5b]/10 ${draggedIndex === index ? 'opacity-50 scale-95 shadow-inner' : ''}`}
                                        >
                                            <div className="flex flex-col gap-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <span className="material-symbols-outlined text-gray-200 dark:text-white/10 cursor-grab active:cursor-grabbing hover:text-[#13ec5b] transition-colors">drag_indicator</span>
                                                        <div className="flex flex-col flex-1">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Label do Campo</label>
                                                            <input
                                                                aria-label={`Rótulo do campo ${field.label}`}
                                                                className="bg-transparent border-none p-0 text-sm font-black text-[#0d1b12] dark:text-white focus:ring-0 w-full placeholder:text-gray-300"
                                                                value={field.label}
                                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                                placeholder="Digite o nome do campo..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        aria-label={`Remover campo ${field.label}`}
                                                        onClick={() => removeField(field.id)}
                                                        className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-black/20 text-gray-300 hover:text-red-500 hover:shadow-lg transition-all active:scale-90"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Tipo de Entrada</label>
                                                        <select
                                                            aria-label={`Tipo de entrada para o campo ${field.label}`}
                                                            className="w-full bg-white dark:bg-[#0d1b12] border-gray-100 dark:border-white/5 rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-[#13ec5b]/10 transition-all cursor-pointer"
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
                                                    <div className="flex items-end pb-1 ml-1">
                                                        <label className="flex items-center gap-3 cursor-pointer group/check">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    aria-label={`Campo ${field.label} obrigatório`}
                                                                    checked={field.required}
                                                                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                                    className="size-5 rounded-lg border-2 border-gray-200 dark:border-white/10 text-[#13ec5b] focus:ring-[#13ec5b]/20 transition-all checked:border-[#13ec5b]"
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-black text-gray-500 group-hover/check:text-[#13ec5b] uppercase tracking-widest transition-colors">Obrigatório</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {field.type === 'select' && (
                                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Opções (Separadas por vírgula)</label>
                                                        <input
                                                            aria-label={`Opções para o campo de seleção ${field.label}`}
                                                            className="w-full bg-white dark:bg-[#0d1b12] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-[#13ec5b]/10 transition-all"
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
                                <div className="bg-[#f8faf8] dark:bg-black/20 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5">
                                    <h4 className="font-black text-[10px] text-[#13ec5b] uppercase tracking-[0.2em] mb-8 pb-4 border-b border-[#13ec5b]/10">Notificação & Entrega</h4>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Receber envios em:</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">alternate_email</span>
                                                <input
                                                    aria-label="E-mail para notificações de novos envios"
                                                    className="w-full text-xs font-bold bg-white dark:bg-[#0d1b12] border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-4 focus:ring-[#13ec5b]/10 transition-all dark:text-white"
                                                    value={formConfig.notificationEmail}
                                                    onChange={(e) => setFormConfig({ ...formConfig, notificationEmail: e.target.value })}
                                                    placeholder="contato@empresa.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mensagem de Sucesso</label>
                                            <textarea
                                                aria-label="Mensagem exibida após envio com sucesso"
                                                className="w-full text-xs font-bold bg-white dark:bg-[#0d1b12] border border-gray-100 dark:border-white/5 rounded-3xl px-6 py-5 h-40 resize-none outline-none focus:ring-4 focus:ring-[#13ec5b]/10 transition-all leading-relaxed dark:text-gray-300"
                                                value={formConfig.successMessage}
                                                onChange={(e) => setFormConfig({ ...formConfig, successMessage: e.target.value })}
                                                placeholder="Defina a mensagem que o usuário verá ao finalizar o envio..."
                                            />
                                        </div>
                                        <div className="pt-4">
                                            <label className="flex items-center gap-5 cursor-pointer p-6 bg-white dark:bg-[#0d1b12] rounded-[1.5rem] border border-gray-100 dark:border-white/5 hover:border-[#13ec5b]/30 transition-all shadow-sm">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        aria-label="Habilitar ou desabilitar o formulário no site"
                                                        checked={formConfig.active}
                                                        onChange={(e) => setFormConfig({ ...formConfig, active: e.target.checked })}
                                                        className="size-6 rounded-lg border-2 border-gray-100 dark:border-white/10 text-[#13ec5b] focus:ring-[#13ec5b]/20"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">Habilitar no Site</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">Visibilidade pública do form</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest max-w-xs text-center md:text-left">
                                As alterações entrarão em vigor imediatamente na interface pública do site.
                            </p>
                            <button
                                aria-label="Salvar todas as configurações do formulário"
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full md:w-auto px-12 py-5 text-[10px] font-black bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-[#13ec5b]/10 transition-all uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <span className="flex items-center justify-center gap-3">
                                    {saving ? (
                                        <>
                                            <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">save</span>
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

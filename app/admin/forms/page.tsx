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
        <div className="flex flex-col min-h-full bg-[#f6f8f6] dark:bg-[#102216]">
            {/* HEADER */}
            <div className="px-6 py-8 md:px-10 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#102216]/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">Gerenciador de Formulários</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                            Personalize os campos, notificações e mensagens de sucesso.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 max-w-6xl mx-auto w-full space-y-10">
                {/* FORM CARD */}
                <div className="bg-white dark:bg-[#183221] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden transition-all hover:border-[#13ec5b]/30">
                    <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#13ec5b]"></div>
                    <div className="p-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined text-3xl">contact_mail</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-black text-xl text-[#0d1b12] dark:text-white tracking-tight">Formulário de Contato</h3>
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${formConfig.active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                            {formConfig.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Página principal (/contato)</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* FIELDS COLUMN */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
                                    <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Campos do Formulário</h4>
                                    <button
                                        onClick={addField}
                                        className="text-[10px] text-[#13ec5b] font-black uppercase tracking-widest hover:underline"
                                    >
                                        + Adicionar Campo
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formConfig.fields.map((field) => (
                                        <div key={field.id} className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-50 dark:border-white/5 group hover:border-[#13ec5b]/30 transition-all">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-gray-300">drag_indicator</span>
                                                        <input
                                                            className="bg-transparent border-none p-0 text-sm font-black text-[#0d1b12] dark:text-white focus:ring-0 w-48"
                                                            value={field.label}
                                                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeField(field.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Tipo</label>
                                                        <select
                                                            className="w-full bg-white dark:bg-[#102216] border-gray-100 dark:border-white/5 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#13ec5b]/20"
                                                            value={field.type}
                                                            onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                                        >
                                                            <option value="text">Texto Simples</option>
                                                            <option value="email">E-mail</option>
                                                            <option value="tel">Telefone</option>
                                                            <option value="textarea">Área de Texto</option>
                                                            <option value="select">Seleção (Dropdown)</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-end pb-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                                className="size-4 rounded border-gray-300 text-[#13ec5b] focus:ring-[#13ec5b]"
                                                            />
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Obrigatório</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {field.type === 'select' && (
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Opções (separadas por vírgula)</label>
                                                        <input
                                                            className="w-full bg-white dark:bg-[#102216] border-gray-100 dark:border-white/5 rounded-xl px-4 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-[#13ec5b]/20"
                                                            value={field.options?.join(", ") || ""}
                                                            onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(o => o.trim()) })}
                                                            placeholder="Opção 1, Opção 2..."
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SETTINGS COLUMN */}
                            <div className="lg:col-span-5 space-y-8">
                                <div>
                                    <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 dark:border-white/5">Configurações de Notificação</h4>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Receber envios em:</label>
                                            <input
                                                className="w-full text-xs font-bold bg-gray-50 dark:bg-white/5 border-transparent rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#13ec5b]/30 transition-all dark:text-white"
                                                value={formConfig.notificationEmail}
                                                onChange={(e) => setFormConfig({ ...formConfig, notificationEmail: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mensagem de Sucesso</label>
                                            <textarea
                                                className="w-full text-xs font-medium bg-gray-50 dark:bg-white/5 border-transparent rounded-2xl px-5 py-4 h-32 resize-none outline-none focus:ring-2 focus:ring-[#13ec5b]/30 transition-all leading-relaxed dark:text-gray-300"
                                                value={formConfig.successMessage}
                                                onChange={(e) => setFormConfig({ ...formConfig, successMessage: e.target.value })}
                                            />
                                        </div>
                                        <div className="pt-4">
                                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-[#13ec5b]/20 transition-all">
                                                <input
                                                    type="checkbox"
                                                    checked={formConfig.active}
                                                    onChange={(e) => setFormConfig({ ...formConfig, active: e.target.checked })}
                                                    className="size-5 rounded border-gray-300 text-[#13ec5b] focus:ring-[#13ec5b]"
                                                />
                                                <div>
                                                    <p className="text-[10px] font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">Habilitar Formulário</p>
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Define se o formulário aparece no site</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-50 dark:border-white/5 flex justify-end gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-10 py-4 text-[10px] font-black bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
                            >
                                {saving ? "Salvando..." : "Salvar Configurações"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

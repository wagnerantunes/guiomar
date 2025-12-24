"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";
import { Skeleton } from "@/components/admin/Skeleton";

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    message: string;
    notes: string | null;
    source: string | null;
    status: string;
    createdAt: string;
}

export default function LeadsPage() {
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [noteText, setNoteText] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchLeads() {
            try {
                const response = await fetch("/api/leads");
                const data = await response.json();
                setLeads(data);
                if (data.length > 0) {
                    setSelectedLeadId(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching leads:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchLeads();
    }, []);

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.company?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "All" || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const selectedLead = filteredLeads.find((l) => l.id === selectedLeadId) || filteredLeads[0];

    useEffect(() => {
        if (selectedLead) {
            setNoteText(selectedLead.notes || "");
        }
    }, [selectedLeadId, leads]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/leads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
                toast({
                    title: "Status Atualizado",
                    description: `O lead foi marcado como ${newStatus === 'Contacted' ? 'Respondido' : 'Arquivado'}.`,
                    type: "success"
                });
            } else {
                toast({ title: "Erro na Atualização", description: "Não foi possível mudar o status.", type: "error" });
            }
        } catch (error) {
            console.error("Error updating lead status:", error);
            toast({ title: "Erro de Conexão", description: "Verifique sua internet.", type: "error" });
        }
    };

    const handleSaveNote = async () => {
        if (!selectedLeadId) return;
        setIsSavingNote(true);
        try {
            const response = await fetch(`/api/leads/${selectedLeadId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: noteText }),
            });
            if (response.ok) {
                setLeads(leads.map(l => l.id === selectedLeadId ? { ...l, notes: noteText } : l));
                toast({
                    title: "Nota Salva",
                    description: "Seu comentário interno foi registrado.",
                    type: "success"
                });
            } else {
                toast({ title: "Erro ao Salvar", description: "Tente novamente mais tarde.", type: "error" });
            }
        } catch (error) {
            console.error("Error saving note:", error);
            toast({ title: "Erro de Conexão", type: "error" });
        } finally {
            setIsSavingNote(false);
        }
    };

    return (
        <div className="flex h-full bg-white dark:bg-background-dark overflow-hidden relative">
            {/* LISTA DE LEADS */}
            <div className={`${selectedLeadId && 'hidden lg:flex'} w-full lg:w-96 border-r border-gray-100 dark:border-white/5 flex flex-col shrink-0 bg-gray-50/30`}>
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">Inbox Leads</h2>
                    <span className="bg-primary text-text-dark text-[10px] font-black px-2 py-0.5 rounded-full">
                        {leads.filter(l => l.status === "New").length} NEW
                    </span>
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 p-1 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm">
                        {["All", "New", "Contacted", "Archived"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === status
                                    ? "bg-primary text-text-dark shadow-sm"
                                    : "text-gray-400 hover:text-primary"
                                    }`}
                            >
                                {status === "All" ? "Tudo" : status === "New" ? "Novos" : status === "Contacted" ? "Lidos" : "Arq."}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                        <input
                            className="w-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl pl-10 py-2.5 text-xs focus:ring-primary/30 outline-none"
                            placeholder="Pesquisar contatos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-5 space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-3 p-2">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-32" variant="text" />
                                        <Skeleton className="h-3 w-10" variant="text" />
                                    </div>
                                    <Skeleton className="h-3 w-20" variant="text" />
                                    <Skeleton className="h-3 w-full" variant="text" />
                                </div>
                            ))}
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Nenhum lead encontrado.
                        </div>
                    ) : filteredLeads.map((lead) => (
                        <div
                            key={lead.id}
                            onClick={() => setSelectedLeadId(lead.id)}
                            className={`p-5 border-b border-gray-50 dark:border-white/5 cursor-pointer transition-all relative group ${selectedLeadId === lead.id ? 'bg-white dark:bg-zinc-800/50 shadow-sm' : 'hover:bg-gray-100/50'
                                }`}
                        >
                            {lead.status === 'New' && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#13ec5b]"></div>}
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm font-black transition-colors ${selectedLeadId === lead.id ? 'text-primary' : 'text-[#0d1b12] dark:text-white'}`}>
                                    {lead.name}
                                </h4>
                                <span className="text-[9px] font-bold text-gray-400">
                                    {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 mb-2 truncate">{lead.company || "Pessoa Física"}</p>
                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                                {lead.message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* DETALHE DO LEAD */}
            <div className={`${!selectedLeadId && 'hidden lg:flex'} flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950`}>
                {selectedLead ? (
                    <>
                        <div className="h-20 px-4 md:px-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-card-dark/80 backdrop-blur-sm shrink-0">
                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                <button
                                    onClick={() => setSelectedLeadId(null)}
                                    className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div className="size-8 md:size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase shadow-inner shrink-0">
                                    {selectedLead.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                    <h3 className="text-xs md:text-sm font-black text-[#0d1b12] dark:text-white uppercase tracking-tight truncate">{selectedLead.name}</h3>
                                    <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate block">{selectedLead.source || "Canal Externo"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <button
                                    onClick={() => handleStatusUpdate(selectedLead.id, "Archived")}
                                    className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-[10px] font-black border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest"
                                    title="Arquivar"
                                >
                                    <span className="material-symbols-outlined text-sm">archive</span>
                                    <span className="hidden md:inline">Arquivar</span>
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedLead.id, "Contacted")}
                                    className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 text-[10px] md:text-xs font-black bg-primary text-text-dark rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    <span className="hidden md:inline">{selectedLead.status === "Contacted" ? "Respondido" : "Marcar respondido"}</span>
                                    <span className="md:hidden">OK</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-16">
                            <div className="max-w-3xl mx-auto space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Informações de Contato</label>
                                            <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-8 space-y-6 border border-gray-100 dark:border-white/5 shadow-inner">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100/50">
                                                        <span className="material-symbols-outlined text-lg">mail</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedLead.email}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                                        <span className="material-symbols-outlined text-lg">call</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedLead.phone || "Não informado"}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="size-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm border border-purple-100/50">
                                                        <span className="material-symbols-outlined text-lg">apartment</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedLead.company || "Pessoa Física"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Contexto</label>
                                            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-inner">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                                                    <span className="text-[10px] font-black text-[#0d1b12] dark:text-gray-300 uppercase tracking-widest opacity-60">Canal de Aquisição</span>
                                                </div>
                                                <p className="text-sm font-black text-primary uppercase tracking-wide">{selectedLead.source || "Direto / Externo"}</p>
                                                <div className="mt-4 pt-4 border-t border-primary/5">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Registrado em</p>
                                                    <p className="text-xs font-bold text-[#0d1b12] dark:text-white mt-1">
                                                        {new Date(selectedLead.createdAt).toLocaleString("pt-BR")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Mensagem Recebida</label>
                                    <div className="bg-white dark:bg-card-dark rounded-3xl p-10 border border-gray-100 dark:border-white/5 shadow-sm">
                                        <p className="text-lg text-[#0d1b12] dark:text-gray-200 leading-relaxed italic font-medium">
                                            "{selectedLead.message}"
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-gray-100 dark:border-white/5 space-y-6">
                                    <h4 className="text-sm font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">Notas Internas</h4>
                                    <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-transparent rounded-2xl p-8 text-sm focus:ring-primary/30 h-40 resize-none outline-none shadow-sm"
                                        placeholder="Adicione anotações sobre este lead aqui... (apenas você vê)"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSaveNote}
                                            disabled={isSavingNote}
                                            className="px-10 py-4 bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                                        >
                                            {isSavingNote ? "Salvando..." : "Salvar Nota"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                        <span className="material-symbols-outlined text-6xl mb-4">inbox</span>
                        <h3 className="text-xl font-black text-[#0d1b12] dark:text-white mb-2 uppercase tracking-widest">Nenhuma conversa selecionada</h3>
                        <p className="max-w-xs text-sm font-medium">Selecione um lead na lista lateral para ver os detalhes da mensagem.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

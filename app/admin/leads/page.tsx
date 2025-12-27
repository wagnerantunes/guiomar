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
        <div className="flex h-full bg-white dark:bg-[#09090b] overflow-hidden relative">
            {/* LISTA DE LEADS */}
            <div
                className={`${selectedLeadId && 'hidden lg:flex'} w-full lg:w-[400px] border-r border-gray-100 dark:border-white/5 flex flex-col shrink-0 bg-[#f8faf8] dark:bg-black/10`}
                role="region"
                aria-label="Lista de Leads"
            >
                <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-transparent">
                    <h2 className="text-lg font-black text-[#0d1b12] dark:text-white uppercase tracking-[0.2em]">Inbox Leads</h2>
                    <span className="bg-[#13ec5b] text-[#0d1b12] text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-[#13ec5b]/20">
                        {leads.filter(l => l.status === "New").length} NOVOS
                    </span>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        {["All", "New", "Contacted", "Archived"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                aria-label={`Filtrar por ${status}`}
                                className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === status
                                    ? "bg-[#13ec5b] text-[#0d1b12] shadow-md"
                                    : "text-gray-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/5"
                                    }`}
                            >
                                {status === "All" ? "Tudo" : status === "New" ? "Novos" : status === "Contacted" ? "Lidos" : "Arq."}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] group-focus-within:text-[#13ec5b] transition-colors">search</span>
                        <input
                            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold text-[#0d1b12] dark:text-white focus:ring-4 focus:ring-[#13ec5b]/10 focus:border-[#13ec5b]/30 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium shadow-sm"
                            placeholder="Pesquisar contatos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Pesquisar leads"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
                    {loading ? (
                        <div className="p-5 space-y-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="space-y-4 p-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-transparent">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ))}
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-20 text-center space-y-4">
                            <span className="material-symbols-outlined text-4xl text-gray-200 dark:text-white/5">search_off</span>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nenhum lead encontrado</p>
                        </div>
                    ) : (
                        <div className="space-y-1 pb-10">
                            {filteredLeads.map((lead) => (
                                <button
                                    key={lead.id}
                                    onClick={() => setSelectedLeadId(lead.id)}
                                    aria-label={`Ver detalhes de ${lead.name}`}
                                    className={`w-full text-left p-6 rounded-3xl transition-all relative group outline-none focus-visible:ring-2 focus-visible:ring-[#13ec5b]/50 ${selectedLeadId === lead.id
                                        ? 'bg-white dark:bg-[#18181b] shadow-xl shadow-[#13ec5b]/5 border-transparent'
                                        : 'hover:bg-white/60 dark:hover:bg-white/5 border-transparent'
                                        }`}
                                >
                                    {lead.status === 'New' && (
                                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#13ec5b] rounded-full shadow-[0_0_12px_#13ec5b]"></div>
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`text-[13px] font-black uppercase tracking-tight transition-colors ${selectedLeadId === lead.id ? 'text-[#13ec5b]' : 'text-[#0d1b12] dark:text-gray-100'}`}>
                                            {lead.name}
                                        </h4>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-[#f6f8f6] dark:bg-white/5 px-2 py-0.5 rounded-md">
                                            {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-500 mb-3 truncate uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100/50 dark:border-white/5 pb-2">
                                        <span className="material-symbols-outlined text-xs">corporate_fare</span>
                                        {lead.company || "Pessoa Física"}
                                    </p>
                                    <p className="text-[11px] font-medium text-gray-400 line-clamp-2 leading-relaxed italic">
                                        "{lead.message}"
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* DETALHE DO LEAD */}
            <div
                className={`${!selectedLeadId && 'hidden lg:flex'} flex-1 flex flex-col min-w-0 bg-white dark:bg-[#18181b]/20 relative`}
                role="main"
                aria-label="Detalhes do Lead"
            >
                {selectedLead ? (
                    <>
                        <div className="h-24 px-6 md:px-12 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl shrink-0 z-10 shadow-sm">
                            <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
                                <button
                                    onClick={() => setSelectedLeadId(null)}
                                    aria-label="Voltar para a lista"
                                    className="lg:hidden p-2.5 -ml-2 text-gray-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/5 rounded-xl transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div className="size-12 md:size-14 rounded-2xl bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] font-black text-xl uppercase shadow-inner shrink-0 border border-[#13ec5b]/10 group-hover:scale-110 transition-transform">
                                    {selectedLead.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                    <h3 className="text-sm md:text-base font-black text-[#0d1b12] dark:text-white uppercase tracking-wider truncate">{selectedLead.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-gray-50 dark:bg-white/5 w-fit rounded-lg border border-gray-100 dark:border-white/5">
                                        <span className="material-symbols-outlined text-[12px] text-gray-400">explore</span>
                                        <span className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] truncate">{selectedLead.source || "Origem Direta"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:gap-4">
                                <button
                                    onClick={() => handleStatusUpdate(selectedLead.id, "Archived")}
                                    aria-label="Arquivar lead"
                                    className="flex items-center gap-2 px-5 py-3 text-[10px] font-black border border-gray-100 dark:border-white/5 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 dark:hover:bg-red-500/10 transition-all uppercase tracking-widest active:scale-95 group shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-12">archive</span>
                                    <span className="hidden md:inline">Arquivar</span>
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedLead.id, "Contacted")}
                                    aria-label="Marcar como respondido"
                                    className={`flex items-center gap-3 px-6 py-4 md:px-8 md:py-4 text-[10px] md:text-xs font-black rounded-2xl shadow-xl shadow-[#13ec5b]/10 hover:shadow-[#13ec5b]/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest ${selectedLead.status === "Contacted"
                                        ? "bg-[#0d1b12] text-[#13ec5b] border border-[#13ec5b]/30"
                                        : "bg-[#13ec5b] text-[#0d1b12]"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    <span className="hidden md:inline">{selectedLead.status === "Contacted" ? "Já Respondido" : "Marcar respondido"}</span>
                                    <span className="md:hidden">OK</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-20 bg-[#fefefe] dark:bg-transparent">
                            <div className="max-w-4xl mx-auto space-y-16">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block ml-4">Dados do Consultante</label>
                                        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-10 space-y-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
                                            <div className="flex items-center gap-6 group">
                                                <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm border border-blue-50 dark:border-blue-500/10 group-hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined text-2xl">mail</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">E-mail Corporativo</span>
                                                    <span className="text-sm font-bold text-[#0d1b12] dark:text-gray-200">{selectedLead.email}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 group">
                                                <div className="size-12 rounded-2xl bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] shadow-sm border border-[#13ec5b]/10 group-hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined text-2xl">call</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Telefone / WhatsApp</span>
                                                    <span className="text-sm font-bold text-[#0d1b12] dark:text-gray-200">{selectedLead.phone || "Não informado"}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 group">
                                                <div className="size-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm border border-purple-50 dark:border-purple-500/10 group-hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined text-2xl">apartment</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Empresa / Instituição</span>
                                                    <span className="text-sm font-bold text-[#0d1b12] dark:text-gray-200">{selectedLead.company || "Pessoa Física"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block ml-4">Linha do Tempo</label>
                                        <div className="bg-[#13ec5b] dark:bg-[#13ec5b] rounded-[2.5rem] p-10 text-zinc-950 shadow-2xl shadow-[#13ec5b]/20 relative overflow-hidden group border border-[#13ec5b]/30">
                                            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-4 opacity-70">
                                                        <span className="material-symbols-outlined text-[16px]">history</span>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Registro de Entrada</span>
                                                    </div>
                                                    <p className="text-2xl font-black leading-tight uppercase tracking-tight">
                                                        {new Date(selectedLead.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-base font-black mt-1 opacity-70">
                                                        às {new Date(selectedLead.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>

                                                <div className="bg-[#0d1b12]/5 dark:bg-black/10 p-5 rounded-3xl border border-[#0d1b12]/10">
                                                    <div className="flex items-center justify-between items-center">
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Tratamento</p>
                                                            <p className="text-xs font-black uppercase">{selectedLead.status === 'New' ? 'Aguardando Resposta' : 'Processado'}</p>
                                                        </div>
                                                        <div className="size-10 rounded-2xl bg-[#0d1b12] text-[#13ec5b] flex items-center justify-center shadow-lg">
                                                            <span className="material-symbols-outlined text-[20px]">bolt</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block ml-4">Mensagem Recebida</label>
                                    <div className="bg-[#f8faf8] dark:bg-white/5 rounded-[3rem] p-12 md:p-16 border border-gray-100 dark:border-white/5 relative group">
                                        <span className="material-symbols-outlined absolute top-10 left-10 text-6xl text-primary/10 select-none group-hover:scale-110 transition-transform">format_quote</span>
                                        <p className="text-xl md:text-2xl text-[#0d1b12] dark:text-gray-200 leading-relaxed italic font-medium relative z-10 pl-6 border-l-4 border-[#13ec5b]/30">
                                            {selectedLead.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-20 border-t border-gray-50 dark:border-white/5 space-y-8 pb-20">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-black text-[#0d1b12] dark:text-white uppercase tracking-widest flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#13ec5b]">edit_note</span>
                                            Notas Internas
                                        </h4>
                                        {selectedLead.notes && <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Última edição: hoje</span>}
                                    </div>
                                    <div className="relative group">
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            aria-label="Notas internas do lead"
                                            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-10 text-base font-medium focus:ring-4 focus:ring-[#13ec5b]/10 focus:border-[#13ec5b]/30 h-64 resize-none outline-none shadow-xl shadow-gray-50/50 dark:shadow-none transition-all placeholder:text-gray-400"
                                            placeholder="Descreva o andamento da negociação, pontos chave ou próximos passos... (Apenas para uso interno)"
                                        />
                                        <div className="absolute bottom-10 right-10">
                                            <button
                                                onClick={handleSaveNote}
                                                disabled={isSavingNote}
                                                className="px-8 py-4 bg-[#0d1b12] dark:bg-[#13ec5b] dark:text-[#0d1b12] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3 group/btn"
                                            >
                                                {isSavingNote ? (
                                                    "Sincronizando..."
                                                ) : (
                                                    <>
                                                        Salvar Alterações
                                                        <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">save</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-200 dark:text-white/5 p-20 text-center animate-in fade-in duration-1000">
                        <div className="size-48 rounded-[3rem] bg-[#f6f8f6] dark:bg-white/5 flex items-center justify-center mb-10 shadow-inner">
                            <span className="material-symbols-outlined text-8xl">inbox</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#0d1b12] dark:text-white mb-4 uppercase tracking-[0.2em]">Selecione uma Mentoria</h3>
                        <p className="max-w-sm text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">
                            Clique em algum lead na lista lateral para iniciar a gestão estratégica e responder ao contato.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

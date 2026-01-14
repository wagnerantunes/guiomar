"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";
import { Skeleton } from "@/components/admin/Skeleton";
import { LeadsKanban } from "@/components/admin/LeadsKanban";

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

    const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden relative text-foreground">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full opacity-20" />
            </div>

            {/* Page Toolbar */}
            <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/60 backdrop-blur-md shrink-0 relative z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">inbox_customize</span>
                        Gestão de Leads
                    </h1>
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20">
                        {leads.length} TOTAL
                    </span>
                </div>

                <div className="flex bg-muted/10 p-1 rounded-xl border border-border">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
                    >
                        <span className="material-symbols-outlined text-sm">list</span>
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('board')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${viewMode === 'board' ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
                    >
                        <span className="material-symbols-outlined text-sm">view_kanban</span>
                        Board
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative z-10">
                {viewMode === 'board' ? (
                    <div className="h-full p-8 overflow-hidden">
                        <LeadsKanban leads={leads} onStatusChange={handleStatusUpdate} />
                    </div>
                ) : (
                    <div className="flex h-full">
                        {/* LISTA DE LEADS */}
                        <div
                            className={`${selectedLeadId && 'hidden lg:flex'} w-full lg:w-[400px] border-r border-border flex flex-col shrink-0 bg-background/80 backdrop-blur-sm`}
                        >
                            <div className="p-6 space-y-6 flex-col flex h-full">
                                {/* Search & Filter Bar */}
                                <div className="space-y-4 shrink-0">
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">search</span>
                                        <input
                                            className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted/50 placeholder:font-medium shadow-sm"
                                            placeholder="Pesquisar contatos..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 p-1.5 bg-muted/5 rounded-2xl border border-border shadow-sm overflow-x-auto">
                                        {["All", "New", "Contacted", "Archived"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap px-2 ${statusFilter === status
                                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                                    : "text-muted hover:text-primary hover:bg-primary/5"
                                                    }`}
                                            >
                                                {status === "All" ? "Tudo" : status === "New" ? "Novos" : status === "Contacted" ? "Lidos" : "Arq."}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
                                    {loading ? (
                                        <div className="py-5 space-y-6">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Skeleton key={i} className="h-24 w-full bg-muted/5 rounded-3xl" />
                                            ))}
                                        </div>
                                    ) : filteredLeads.length === 0 ? (
                                        <div className="py-20 text-center space-y-4">
                                            <span className="material-symbols-outlined text-4xl text-muted/20">search_off</span>
                                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Nada encontrado</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 pb-10">
                                            {filteredLeads.map((lead, idx) => (
                                                <button
                                                    key={lead.id}
                                                    onClick={() => setSelectedLeadId(lead.id)}
                                                    className={`w-full text-left p-5 rounded-[2rem] transition-all relative group outline-none animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both border ${selectedLeadId === lead.id
                                                        ? 'bg-primary/5 shadow-xl shadow-primary/5 border-primary/20 ring-1 ring-primary/10'
                                                        : 'hover:bg-muted/5 border-transparent hover:border-border'
                                                        }`}
                                                >
                                                    {lead.status === 'New' && (
                                                        <div className="absolute top-5 right-5 w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.5)] z-20"></div>
                                                    )}
                                                    <div className="mb-2">
                                                        <h4 className={`text-xs font-black uppercase tracking-tight transition-colors ${selectedLeadId === lead.id ? 'text-primary' : 'text-foreground'}`}>
                                                            {lead.name}
                                                        </h4>
                                                        <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                                                            {lead.company || "Individual"}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] font-medium text-muted-foreground line-clamp-2 italic leading-relaxed">
                                                        "{lead.message}"
                                                    </p>
                                                    <span className="text-[9px] font-bold text-muted/50 mt-3 block">
                                                        {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' })}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DETALHE DO LEAD */}
                        <div className={`${!selectedLeadId && 'hidden lg:flex'} flex-1 flex flex-col min-w-0 bg-background/50 relative z-10`}>
                            {selectedLead ? (
                                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="h-auto py-6 px-8 border-b border-border flex flex-col md:flex-row items-center justify-between bg-background/40 backdrop-blur-2xl shrink-0 gap-4">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <button
                                                onClick={() => setSelectedLeadId(null)}
                                                className="lg:hidden p-2 text-muted"
                                            >
                                                <span className="material-symbols-outlined">arrow_back</span>
                                            </button>
                                            <div className="size-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl uppercase shadow-lg shadow-primary/20 shrink-0">
                                                {selectedLead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-foreground uppercase tracking-wider">{selectedLead.name}</h3>
                                                <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{selectedLead.source || "Origem desconhecida"}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                                            <button
                                                onClick={() => handleStatusUpdate(selectedLead.id, "Archived")}
                                                className="px-4 py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                                            >
                                                Arquivar
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(selectedLead.id, "Contacted")}
                                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shrink-0 ${selectedLead.status === "Contacted" ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                                            >
                                                {selectedLead.status === "Contacted" ? "Respondido" : "Marcar Respondido"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                        <div className="max-w-3xl mx-auto space-y-12 pb-20">

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm">
                                                    <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-6">Contato</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex gap-4">
                                                            <span className="material-symbols-outlined text-primary">mail</span>
                                                            <span className="text-sm font-bold break-all">{selectedLead.email}</span>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <span className="material-symbols-outlined text-primary">call</span>
                                                            <span className="text-sm font-bold">{selectedLead.phone || "---"}</span>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <span className="material-symbols-outlined text-primary">apartment</span>
                                                            <span className="text-sm font-bold">{selectedLead.company || "Individual"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                                                    <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-6">Detalhes</h4>
                                                    <p className="text-sm font-bold mb-2">Recebido em:</p>
                                                    <p className="text-lg text-primary font-black mb-4">
                                                        {new Date(selectedLead.createdAt).toLocaleDateString("pt-BR", { dateStyle: 'long', timeZone: 'America/Sao_Paulo' })}
                                                    </p>
                                                    <p className="text-[10px] uppercase font-black tracking-widest opacity-50">
                                                        às {new Date(selectedLead.createdAt).toLocaleTimeString("pt-BR", { timeZone: 'America/Sao_Paulo' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-muted uppercase tracking-widest ml-4">Mensagem</h4>
                                                <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm italic text-lg leading-relaxed text-foreground/80 relative">
                                                    <span className="material-symbols-outlined absolute top-6 left-6 text-primary/10 text-6xl -z-0">format_quote</span>
                                                    <span className="relative z-10">{selectedLead.message}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-8 border-t border-border">
                                                <h4 className="text-[10px] font-black text-muted uppercase tracking-widest ml-4">Notas Internas</h4>
                                                <textarea
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    className="w-full bg-card border border-border rounded-[2rem] p-6 h-48 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                                    placeholder="Adicione observações sobre esse cliente..."
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={handleSaveNote}
                                                        disabled={isSavingNote}
                                                        className="px-6 py-3 bg-foreground text-background rounded-xl text-xs font-black uppercase tracking-widest hover:bg-foreground/80 transition-all disabled:opacity-50"
                                                    >
                                                        {isSavingNote ? "Salvando..." : "Salvar Nota"}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted/30">
                                    <span className="material-symbols-outlined text-9xl mb-4">inbox</span>
                                    <p className="text-xs font-black uppercase tracking-widest">Nenhum Lead Selecionado</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

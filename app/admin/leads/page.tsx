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
        <div className="flex h-full bg-background overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full opacity-20" />
            </div>

            {/* LISTA DE LEADS */}
            <div
                className={`${selectedLeadId && 'hidden lg:flex'} w-full lg:w-[400px] border-r border-border flex flex-col shrink-0 bg-background/80 backdrop-blur-sm`}
                role="region"
                aria-label="Lista de Leads"
            >
                <div className="p-8 border-b border-border flex items-center justify-between bg-transparent">
                    <h2 className="text-lg font-black text-foreground uppercase tracking-[0.2em]">Inbox Leads</h2>
                    <span className="bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-primary/20">
                        {leads.filter(l => l.status === "New").length} NOVOS
                    </span>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-1.5 p-1.5 bg-muted/5 rounded-2xl border border-border shadow-sm">
                        {["All", "New", "Contacted", "Archived"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                aria-label={`Filtrar por ${status}`}
                                className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === status
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted hover:text-primary hover:bg-primary/5"
                                    }`}
                            >
                                {status === "All" ? "Tudo" : status === "New" ? "Novos" : status === "Contacted" ? "Lidos" : "Arq."}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted/50 placeholder:font-medium shadow-sm"
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
                                <div key={i} className="space-y-4 p-4 rounded-3xl bg-muted/5 border border-transparent">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-32 bg-muted/5" />
                                        <Skeleton className="h-3 w-12 bg-muted/5" />
                                    </div>
                                    <Skeleton className="h-3 w-24 bg-muted/5" />
                                    <Skeleton className="h-12 w-full bg-muted/5" />
                                </div>
                            ))}
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-20 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                            <span className="material-symbols-outlined text-4xl text-muted/20">search_off</span>
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Nenhum lead encontrado</p>
                        </div>
                    ) : (
                        <div className="space-y-2 pb-10">
                            {filteredLeads.map((lead, idx) => (
                                <button
                                    key={lead.id}
                                    onClick={() => setSelectedLeadId(lead.id)}
                                    // Staggered entrance animation
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                    className={`w-full text-left p-6 rounded-[2rem] transition-all relative group outline-none animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both ${selectedLeadId === lead.id
                                        ? 'bg-primary/5 shadow-xl shadow-primary/5 border-transparent ring-1 ring-primary/20'
                                        : 'hover:bg-muted/5 border-transparent'
                                        }`}
                                >
                                    {lead.status === 'New' && (
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.5)] z-20"></div>
                                    )}
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <h4 className={`text-[13px] font-black uppercase tracking-tight transition-colors ${selectedLeadId === lead.id ? 'text-primary' : 'text-foreground'}`}>
                                            {lead.name}
                                        </h4>
                                        <span className="text-[9px] font-black text-muted uppercase tracking-widest bg-muted/10 px-2 py-0.5 rounded-md">
                                            {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black text-muted mb-3 truncate uppercase tracking-widest flex items-center gap-1.5 border-b border-border pb-2 relative z-10">
                                        <span className="material-symbols-outlined text-xs">corporate_fare</span>
                                        {lead.company || "Pessoa Física"}
                                    </p>
                                    <p className="text-[11px] font-medium text-muted line-clamp-2 leading-relaxed italic relative z-10">
                                        "{lead.message}"
                                    </p>

                                    {/* Subtle Glass Glow on Active */}
                                    {selectedLeadId === lead.id && (
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-[2rem] pointer-events-none" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* DETALHE DO LEAD */}
            <div
                className={`${!selectedLeadId && 'hidden lg:flex'} flex-1 flex flex-col min-w-0 bg-background/50 relative z-10`}
                role="main"
                aria-label="Detalhes do Lead"
            >
                {selectedLead ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="h-24 px-6 md:px-12 border-b border-border flex items-center justify-between bg-background/40 backdrop-blur-2xl shrink-0 z-10 shadow-sm ring-1 ring-border">
                            <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
                                <button
                                    onClick={() => setSelectedLeadId(null)}
                                    aria-label="Voltar para a lista"
                                    className="lg:hidden p-2.5 -ml-2 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div className="size-12 md:size-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl uppercase shadow-[0_0_30px_rgba(var(--primary),0.2)] shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                                    {selectedLead.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                    <h3 className="text-sm md:text-base font-black text-foreground uppercase tracking-wider truncate">{selectedLead.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-primary/10 w-fit rounded-lg border border-primary/10">
                                        <span className="material-symbols-outlined text-[10px] text-primary">explore</span>
                                        <span className="text-[9px] md:text-[10px] text-primary font-black uppercase tracking-[0.2em] truncate">{selectedLead.source || "Origem Direta"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:gap-4">
                                <button
                                    onClick={() => handleStatusUpdate(selectedLead.id, "Archived")}
                                    aria-label="Arquivar lead"
                                    className="flex items-center gap-2 px-5 py-3 text-[10px] font-black border border-border rounded-2xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all uppercase tracking-widest active:scale-95 group shadow-sm bg-muted/5"
                                >
                                    <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-12">archive</span>
                                    <span className="hidden md:inline">Arquivar</span>
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedLead.id, "Contacted")}
                                    aria-label="Marcar como respondido"
                                    className={`flex items-center gap-3 px-6 py-4 md:px-8 md:py-4 text-[10px] md:text-xs font-black rounded-2xl shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest ${selectedLead.status === "Contacted"
                                        ? "bg-primary/10 text-primary border border-primary/30"
                                        : "bg-primary text-primary-foreground shadow-primary/10 hover:bg-primary/90"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    <span className="hidden md:inline">{selectedLead.status === "Contacted" ? "Já Respondido" : "Marcar respondido"}</span>
                                    <span className="md:hidden">OK</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-16 lg:p-24 bg-transparent">
                            <div className="max-w-4xl mx-auto space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] block ml-4">Informações de Contato</label>
                                        <div className="bg-card/50 backdrop-blur-sm rounded-[2.5rem] p-10 space-y-8 border border-border shadow-xl shadow-black/20">
                                            <div className="flex items-center gap-6 group">
                                                <div className="size-12 rounded-2xl bg-muted/5 flex items-center justify-center text-muted group-hover:text-primary group-hover:bg-primary/10 transition-all border border-border">
                                                    <span className="material-symbols-outlined text-2xl">mail</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">E-mail</span>
                                                    <span className="text-sm font-bold text-foreground break-all">{selectedLead.email}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 group">
                                                <div className="size-12 rounded-2xl bg-muted/5 flex items-center justify-center text-muted group-hover:text-primary group-hover:bg-primary/10 transition-all border border-border">
                                                    <span className="material-symbols-outlined text-2xl">call</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Telefone</span>
                                                    <span className="text-sm font-bold text-foreground">{selectedLead.phone || "Não informado"}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 group">
                                                <div className="size-12 rounded-2xl bg-muted/5 flex items-center justify-center text-muted group-hover:text-primary group-hover:bg-primary/10 transition-all border border-border">
                                                    <span className="material-symbols-outlined text-2xl">apartment</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Empresa</span>
                                                    <span className="text-sm font-bold text-foreground">{selectedLead.company || "Pessoa Física"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] block ml-4">Dados Técnicos</label>
                                        <div className="bg-primary/20 backdrop-blur-md rounded-[2.5rem] p-10 text-primary-foreground shadow-2xl relative overflow-hidden group border border-primary/20">
                                            <div className="relative z-10 flex flex-col justify-between h-full space-y-10">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-4 opacity-50">
                                                        <span className="material-symbols-outlined text-[16px]">history</span>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Recebido em</span>
                                                    </div>
                                                    <p className="text-2xl font-black leading-tight uppercase tracking-tight text-primary">
                                                        {new Date(selectedLead.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-base font-black mt-1 opacity-50">
                                                        às {new Date(selectedLead.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>

                                                <div className="bg-background/20 p-5 rounded-3xl border border-background/10">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Status Interno</p>
                                                            <p className="text-xs font-black uppercase tracking-widest">{selectedLead.status === 'New' ? 'Aguardando' : 'Processado'}</p>
                                                        </div>
                                                        <div className="size-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                                            <span className="material-symbols-outlined text-[24px]">bolt</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Decorative Element */}
                                            <div className="absolute -right-20 -bottom-20 size-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] block ml-4">Conteúdo da Mensagem</label>
                                    <div className="bg-card/50 backdrop-blur-sm rounded-[3rem] p-12 md:p-16 border border-border relative group shadow-sm hover:border-primary/10 transition-colors">
                                        <span className="material-symbols-outlined absolute top-10 left-10 text-7xl text-primary/5 select-none transition-transform duration-700 group-hover:scale-110">format_quote</span>
                                        <p className="text-xl md:text-2xl text-foreground leading-relaxed italic font-medium relative z-10 pl-6 border-l-2 border-primary/20">
                                            {selectedLead.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-border space-y-8 pb-32">
                                    <div className="flex items-center justify-between px-4">
                                        <h4 className="text-[11px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary">edit_note</span>
                                            Área de Anotações Estratégicas
                                        </h4>
                                    </div>
                                    <div className="relative group">
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            aria-label="Notas internas do lead"
                                            className="w-full bg-card/50 backdrop-blur-sm border border-border rounded-[2.5rem] p-10 text-base font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/30 h-72 resize-none outline-none shadow-xl shadow-black/10 transition-all placeholder:text-foreground/10 text-foreground"
                                            placeholder="Documente aqui o progresso do lead..."
                                        />
                                        <div className="absolute bottom-8 right-8">
                                            <button
                                                onClick={handleSaveNote}
                                                disabled={isSavingNote}
                                                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/10 disabled:opacity-50 flex items-center gap-3 group/btn"
                                            >
                                                {isSavingNote ? (
                                                    <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-lg">save</span>
                                                )}
                                                {isSavingNote ? "Salvando..." : "Atualizar Notas"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted/5 p-20 text-center animate-in fade-in zoom-in-95 duration-1000">
                        <div className="size-48 rounded-[4rem] bg-muted/5 flex items-center justify-center mb-10 shadow-lg shadow-black/5 border border-border group">
                            <span className="material-symbols-outlined text-8xl transition-all group-hover:scale-110 group-hover:text-primary opacity-20">inbox</span>
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-[0.2em]">Selecione um Lead</h3>
                        <p className="max-w-xs text-[10px] font-black text-muted uppercase tracking-widest leading-loose">
                            Sua caixa de entrada estratégica está aguardando ação. Inicie a conversão agora.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

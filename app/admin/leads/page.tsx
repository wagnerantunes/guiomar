"use client";

import React, { useState, useEffect } from "react";

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
    const [loading, setLoading] = useState(true);
    const [noteText, setNoteText] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);

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

    const selectedLead = leads.find((l) => l.id === selectedLeadId);

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
            }
        } catch (error) {
            console.error("Error updating lead status:", error);
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
                alert("Nota salva com sucesso!");
            }
        } catch (error) {
            console.error("Error saving note:", error);
        } finally {
            setIsSavingNote(false);
        }
    };

    return (
        <div className="flex h-full bg-white dark:bg-[#102216] overflow-hidden">
            {/* LISTA DE LEADS */}
            <div className="w-96 border-r border-gray-100 dark:border-white/5 flex flex-col shrink-0 bg-[#f6f8f6]/30 dark:bg-black/10">
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">
                        Inbox Leads
                    </h2>
                    <span className="bg-[#13ec5b] text-[#0d1b12] text-[10px] font-black px-2 py-0.5 rounded-full">
                        {leads.filter(l => l.status === "New").length} NEW
                    </span>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                        <input
                            className="w-full bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 rounded-2xl pl-10 pr-4 py-3 text-xs focus:ring-2 focus:ring-[#13ec5b]/30 outline-none shadow-sm font-medium"
                            placeholder="Pesquisar contatos..."
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Carregando leads...
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            Nenhum lead recebido ainda.
                        </div>
                    ) : leads.map((lead) => (
                        <div
                            key={lead.id}
                            onClick={() => setSelectedLeadId(lead.id)}
                            className={`p-6 border-b border-gray-50 dark:border-white/5 cursor-pointer transition-all relative group ${selectedLeadId === lead.id ? "bg-white dark:bg-[#13ec5b]/5 shadow-sm" : "hover:bg-gray-100/50"
                                }`}
                        >
                            {lead.status === "New" && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#13ec5b] rounded-full shadow-[0_0_8px_#13ec5b]"></div>
                            )}
                            <div className="flex justify-between items-start mb-1 pl-2">
                                <h4 className={`text-sm font-black transition-colors ${selectedLeadId === lead.id ? "text-[#13ec5b]" : "text-[#0d1b12] dark:text-white"}`}>
                                    {lead.name}
                                </h4>
                                <span className="text-[9px] font-bold text-gray-400">
                                    {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 mb-2 truncate pl-2">{lead.company || "Pessoa Física"}</p>
                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed pl-2 font-medium">
                                {lead.message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* DETALHE DO LEAD */}
            <div className="flex-1 flex flex-col min-w-0">
                {selectedLead ? (
                    <>
                        <div className="h-20 px-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#102216]/80 backdrop-blur-sm shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-2xl bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] font-black uppercase text-xl shadow-inner border border-[#13ec5b]/5">
                                    {selectedLead.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-[#0d1b12] dark:text-white uppercase tracking-tight">{selectedLead.name}</h3>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedLead.source || "Canal Externo"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleStatusUpdate(selectedLead.id, "Archived")}
                                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest"
                                >
                                    <span className="material-symbols-outlined text-sm">archive</span>
                                    Arquivar
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedLead.id, "Contacted")}
                                    className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black bg-[#13ec5b] text-[#0d1b12] rounded-xl shadow-lg shadow-[#13ec5b]/10 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Respondido
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-16">
                            <div className="max-w-3xl mx-auto space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-1">Informações de Contato</label>
                                            <div className="bg-gray-50 dark:bg-[#183221] rounded-3xl p-8 space-y-6 border border-gray-100 dark:border-white/5 shadow-inner">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100/50">
                                                        <span className="material-symbols-outlined text-lg">mail</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedLead.email}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="size-8 rounded-xl bg-green-50 dark:bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] shadow-sm border border-[#13ec5b]/10">
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
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-1">Contexto</label>
                                            <div className="bg-[#13ec5b]/5 dark:bg-[#13ec5b]/5 rounded-3xl p-8 border border-[#13ec5b]/10 shadow-inner">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="material-symbols-outlined text-[#13ec5b] text-sm">location_on</span>
                                                    <span className="text-[10px] font-black text-[#0d1b12] dark:text-gray-300 uppercase tracking-widest opacity-60">Canal de Aquisição</span>
                                                </div>
                                                <p className="text-sm font-black text-[#13ec5b] uppercase tracking-wide">{selectedLead.source || "Direto / Externo"}</p>
                                                <div className="mt-4 pt-4 border-t border-[#13ec5b]/5">
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
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Mensagem Recebida</label>
                                    <div className="bg-white dark:bg-[#183221] rounded-[3rem] p-12 border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <span className="material-symbols-outlined text-8xl">format_quote</span>
                                        </div>
                                        <p className="text-lg text-[#0d1b12] dark:text-gray-200 leading-relaxed italic font-medium relative z-10">
                                            "{selectedLead.message}"
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-gray-100 dark:border-white/5 space-y-6">
                                    <h4 className="text-sm font-black text-[#0d1b12] dark:text-white uppercase tracking-widest ml-1">Notas Internas</h4>
                                    <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-white/5 border-transparent rounded-[2rem] p-8 text-sm focus:ring-2 focus:ring-[#13ec5b]/30 h-40 resize-none outline-none shadow-inner"
                                        placeholder="Adicione anotações sobre este lead aqui... (apenas você vê)"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSaveNote}
                                            disabled={isSavingNote}
                                            className="px-10 py-4 bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                                        >
                                            {isSavingNote ? "Salvando..." : "Salvar Nota"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10 text-center animate-in fade-in duration-500">
                        <div className="size-24 rounded-[2rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl">inbox</span>
                        </div>
                        <h3 className="text-xl font-black text-[#0d1b12] dark:text-white mb-2 uppercase tracking-widest">Sua Inbox está pronta</h3>
                        <p className="max-w-xs text-sm font-medium text-gray-400">Selecione um lead na lista lateral para ver os detalhes da mensagem.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Types ---
interface Lead {
    id: string;
    name: string;
    company: string | null;
    status: string;
    createdAt: string;
    message: string;
}

interface LeadsKanbanProps {
    leads: Lead[];
    onStatusChange: (id: string, newStatus: string) => void;
}

// --- Draggable Card ---
function SortableLeadCard({ lead }: { lead: Lead }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: lead.id, data: { lead } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-5 rounded-2xl border bg-card mb-3 shadow-sm cursor-grab active:cursor-grabbing group hover:border-primary/50 transition-all ${isDragging ? 'opacity-50 ring-2 ring-primary rotate-3 z-50' : 'border-border'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-xs font-black text-foreground uppercase tracking-tight">{lead.name}</h4>
                <span className="text-[9px] font-bold text-muted bg-muted/10 px-2 py-0.5 rounded ml-2">
                    {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: '2-digit' })}
                </span>
            </div>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">apartment</span>
                {lead.company || 'Individual'}
            </p>
            <p className="text-[10px] text-muted-foreground line-clamp-2 italic leading-relaxed">
                "{lead.message}"
            </p>
        </div>
    );
}

// --- Column ---
function KanbanColumn({ id, title, leads, icon, color }: { id: string, title: string, leads: Lead[], icon: string, color: string }) {
    const { setNodeRef } = useSortable({ id });

    return (
        <div ref={setNodeRef} className="flex flex-col bg-muted/5 rounded-[2rem] border border-border h-full min-h-[500px] w-[350px] shrink-0">
            <div className="p-6 pb-4 flex items-center justify-between sticky top-0 bg-transparent z-10">
                <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg flex items-center justify-center text-white shadow-lg ${color}`}>
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                    </div>
                    <h3 className="text-xs font-black text-foreground uppercase tracking-widest">{title}</h3>
                </div>
                <span className="text-[10px] font-black text-muted bg-background border border-border px-2 py-1 rounded-full">
                    {leads.length}
                </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.map(lead => (
                        <SortableLeadCard key={lead.id} lead={lead} />
                    ))}
                </SortableContext>
                {leads.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-muted/30">
                        <span className="material-symbols-outlined text-2xl mb-2">inbox</span>
                        <span className="text-[9px] uppercase font-black tracking-widest">Vazio</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function LeadsKanban({ leads, onStatusChange }: LeadsKanbanProps) {
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const columns = [
        { id: 'New', title: 'Novos', icon: 'star', color: 'bg-blue-500' },
        { id: 'Contacted', title: 'Em Andamento', icon: 'chat', color: 'bg-yellow-500' },
        { id: 'Closed', title: 'Convertidos', icon: 'check_circle', color: 'bg-green-500' }, // Adding Closed as separate from Archived for Kanban flow
        { id: 'Archived', title: 'Arquivados', icon: 'archive', color: 'bg-gray-500' },
    ];

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeLeadId = active.id;
        // Find which column the item was dropped into
        // If dropped over a container (Column ID) or an Item in a container
        let newStatus = over.id;

        // Verify if over.id is a lead ID or a column ID
        const isOverColumn = columns.some(c => c.id === over.id);

        if (!isOverColumn) {
            // If dropped over another card, find that card's status
            const overLead = leads.find(l => l.id === over.id);
            if (overLead) {
                newStatus = overLead.status;
            }
        }

        // Only update if status changed
        const currentLead = leads.find(l => l.id === activeLeadId);
        if (currentLead && currentLead.status !== newStatus && columns.some(c => c.id === newStatus)) {
            onStatusChange(activeLeadId, newStatus);
        }
    };

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 overflow-x-auto pb-6 h-full items-start px-2">
                {columns.map(col => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        icon={col.icon}
                        color={col.color}
                        leads={leads.filter(l => l.status === col.id || (col.id === 'Contacted' && l.status === 'Contacted'))} // Filter logic
                    />
                ))}
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
            }}>
                {activeLead ? (
                    <div className="p-5 rounded-2xl border bg-card shadow-2xl ring-2 ring-primary rotate-3">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xs font-black text-foreground uppercase tracking-tight">{activeLead.name}</h4>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 italic">"{activeLead.message}"</p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

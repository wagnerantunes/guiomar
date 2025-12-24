"use client";

import React, { useState } from "react";

export default function FormsPage() {
    const [activeTab, setActiveTab] = useState("fields");

    return (
        <div className="flex flex-col min-h-full bg-[#f6f8f6] dark:bg-[#102216]">
            {/* HEADER */}
            <div className="px-6 py-8 md:px-10 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#102216]/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white tracking-tight">Forms Management</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                            Customize website forms, view submissions, and configure notifications.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Export All
                        </button>
                        <button className="flex items-center gap-2 px-8 py-3 text-[10px] font-black bg-[#13ec5b] text-[#0d1b12] rounded-xl shadow-lg shadow-[#13ec5b]/20 hover:scale-105 transition-all">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Create Form
                        </button>
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
                                        <h3 className="font-black text-xl text-[#0d1b12] dark:text-white tracking-tight">Contact Page Form</h3>
                                        <span className="text-[9px] font-black px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 border border-green-100 dark:border-green-500/20 uppercase tracking-widest">Active</span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Main inquiry form at /contact</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="size-11 border border-gray-100 dark:border-white/5 rounded-[1rem] flex items-center justify-center text-gray-400 hover:text-[#13ec5b] hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                </button>
                                <button className="size-11 border border-gray-100 dark:border-white/5 rounded-[1rem] flex items-center justify-center text-gray-400 hover:text-[#13ec5b] hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                    <span className="material-symbols-outlined text-lg">file_download</span>
                                </button>
                                <button className="size-11 bg-[#13ec5b]/10 text-[#13ec5b] rounded-[1rem] flex items-center justify-center hover:scale-105 transition-all">
                                    <span className="material-symbols-outlined text-lg">settings</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
                                    <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Form Fields</h4>
                                    <button className="text-[10px] text-[#13ec5b] font-black uppercase tracking-widest hover:underline">+ Add Field</button>
                                </div>
                                <div className="space-y-4">
                                    {["Full Name", "Email Address", "Inquiry Type", "Message"].map((field, idx) => (
                                        <div key={field} className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center gap-5 border border-gray-50 dark:border-white/5 group hover:border-[#13ec5b]/30 transition-all cursor-move">
                                            <span className="material-symbols-outlined text-gray-300 group-hover:text-[#13ec5b] transition-colors">drag_indicator</span>
                                            <div className="flex-1 grid grid-cols-2 gap-8">
                                                <div>
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Label</label>
                                                    <div className="text-sm font-black text-[#0d1b12] dark:text-white">{field}</div>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Type</label>
                                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{idx === 3 ? "Textarea" : idx === 2 ? "Dropdown" : idx === 1 ? "Email" : "Text Input"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-5 space-y-8">
                                <div>
                                    <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 dark:border-white/5">Notification Settings</h4>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Send Submissions to</label>
                                            <input
                                                className="w-full text-xs font-bold bg-gray-50 dark:bg-white/5 border-transparent rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#13ec5b]/30 transition-all"
                                                defaultValue="contact@renovamente.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Success Message</label>
                                            <textarea
                                                className="w-full text-xs font-medium bg-gray-50 dark:bg-white/5 border-transparent rounded-2xl px-5 py-4 h-32 resize-none outline-none focus:ring-2 focus:ring-[#13ec5b]/30 transition-all leading-relaxed"
                                                defaultValue="Thank you for contacting us! Our team will get back to you shortly."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-50 dark:border-white/5 flex justify-end gap-4">
                            <button className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Discard Changes</button>
                            <button className="px-10 py-4 text-[10px] font-black bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest active:scale-95">
                                Save Form
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

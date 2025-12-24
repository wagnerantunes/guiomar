"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/admin" },
    { id: "leads", label: "Leads & Inbox", icon: "inbox", href: "/admin/leads", badge: 5 },
    { id: "sections", label: "Page Sections", icon: "view_quilt", href: "/admin/sections" },
    { id: "navigation", label: "Menu & Footer", icon: "menu_open", href: "/admin/navigation" },
    { id: "newsletter", label: "Newsletter", icon: "campaign", href: "/admin/newsletter" },
    { id: "blog", label: "Blog Posts", icon: "article", href: "/admin/posts" },
    { id: "forms", label: "Forms Editor", icon: "check_box", href: "/admin/forms" },
    { id: "media", label: "Media Library", icon: "image", href: "/admin/media" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <aside className="w-64 bg-white dark:bg-[#183221] border-r border-[#e7f3eb] dark:border-white/10 hidden lg:flex flex-col flex-shrink-0">
            <div className="p-6 flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                    Main Menu
                </span>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-left ${isActive
                                ? "bg-[#13ec5b]/10 text-[#13ec5b]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-[#13ec5b] dark:text-gray-300 dark:hover:bg-white/5"
                                }`}
                        >
                            <span
                                className={`material-symbols-outlined text-[20px] ${isActive ? "fill-1" : ""
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span className="text-sm">{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto bg-[#13ec5b] text-[#0d1b12] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto p-6 border-t border-gray-100 dark:border-white/10">
                <Link
                    href="/admin/settings"
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-left ${pathname === "/admin/settings"
                        ? "bg-[#13ec5b]/10 text-[#13ec5b]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#13ec5b] dark:text-gray-300 dark:hover:bg-white/5"
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    <span className="text-sm">Settings</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-white/5 mt-1"
                >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}


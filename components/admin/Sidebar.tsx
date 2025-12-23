"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Image,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Categorias", href: "/admin/categories", icon: FolderOpen },
    { name: "Mídia", href: "/admin/media", icon: Image },
    { name: "Configurações", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-[#102216] text-white overflow-y-auto
          transform transition-transform duration-300 ease-in-out z-40 border-r border-[#1f422b]
          ${mobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-[#1f422b]">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <span className="text-[#13ec5b]">Renova</span>Mente
                        </h1>
                        <p className="text-xs text-[#4c9a66] mt-1 font-medium tracking-wider uppercase">
                            Painel Administrativo
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive
                                            ? "bg-[#13ec5b] text-[#0d1b12] font-bold shadow-lg shadow-[#13ec5b]/20"
                                            : "text-gray-300 hover:bg-[#1f422b] hover:text-white"
                                        }
                  `}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-[#1f422b]">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-[#1f422b] hover:text-white transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Sair</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
            )}
        </>
    );
}

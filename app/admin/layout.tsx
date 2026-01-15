import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import { ToastProvider } from "@/components/admin/Toast";

import { CommandPalette } from "@/components/admin/CommandPalette";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <ToastProvider>
            <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
                <CommandPalette />
                {/* Ambient Background Overlay - subtle and premium */}
                <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                    <div className="absolute top-0 left-1/4 w-1/2 h-[500px] bg-gradient-to-b from-primary/10 to-transparent blur-[120px]" />
                </div>

                <AdminHeader />
                <div className="flex flex-1 overflow-hidden relative z-10 transition-colors duration-500">
                    <Sidebar />
                    <main
                        className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-background/40 backdrop-blur-sm"
                        aria-label="Admin Content"
                    >
                        <div className="relative z-10">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}

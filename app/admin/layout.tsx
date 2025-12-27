import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import { ToastProvider } from "@/components/admin/Toast";

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
            <div className="flex flex-col h-screen overflow-hidden bg-[#09090b] text-gray-100 font-sans selection:bg-[#13ec5b] selection:text-black">
                {/* Ambient Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#13ec5b]/5 to-transparent blur-3xl opacity-20" />
                </div>

                <AdminHeader />
                <div className="flex flex-1 overflow-hidden relative z-10">
                    <Sidebar />
                    <main
                        className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-[#09090b]"
                        aria-label="Admin Content"
                    >
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}

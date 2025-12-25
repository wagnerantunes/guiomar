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
            <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0d1b12]">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main
                        className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-[#f8faf8] dark:bg-[#102216]/50"
                        aria-label="Admin Content"
                    >
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}

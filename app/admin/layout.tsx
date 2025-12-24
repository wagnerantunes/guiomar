import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

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
        <div className="flex flex-col h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216]">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-[#f6f8f6] dark:bg-[#102216]">
                    {children}
                </main>
            </div>
        </div>
    );
}

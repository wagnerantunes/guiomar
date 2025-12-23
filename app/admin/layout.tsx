import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[#f6f8f6] font-display">
            <Sidebar />
            <main className="lg:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}

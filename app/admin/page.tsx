import { auth } from '@/lib/auth';
import React from 'react';
import DashboardContent from './DashboardContent';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
    const session = await auth();

    // Get user's site just to verify it exists
    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session?.user?.id },
    });

    if (!siteUser) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-[#0d1b12] dark:text-white">Site não encontrado</h2>
                <p className="text-gray-500">Certifique-se de que sua conta está vinculada a um site.</p>
            </div>
        );
    }

    return <DashboardContent session={session} />;
}

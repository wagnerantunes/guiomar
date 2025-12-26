import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import React from "react";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
    const session = await auth();

    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session?.user?.id },
        include: {
            site: {
                select: {
                    id: true,
                    name: true,
                    domain: true,
                    description: true,
                    favicon: true,
                    logo: true,
                    ogImage: true,
                }
            }
        },
    });

    if (!siteUser) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-gray-900">Site não encontrado</h2>
                <p className="text-gray-600 mt-2">Certifique-se de que sua conta está vinculada a um site.</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10">
            <SettingsForm site={siteUser.site} />
        </div>
    );
}

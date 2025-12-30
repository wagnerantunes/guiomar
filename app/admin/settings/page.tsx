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
                    logoDark: true,
                    logoLight: true,
                    logoAdmin: true,
                    ogImage: true,
                    settings: true,
                }
            }
        },
    });

    if (!siteUser) {
        return (
            <div className="p-20 text-center">
                <div className="size-20 bg-muted/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-muted/20">domain_disabled</span>
                </div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-[0.2em]">Site não encontrado</h2>
                <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Certifique-se de que sua conta está vinculada a um site.</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10">
            <SettingsForm site={siteUser.site} />
        </div>
    );
}

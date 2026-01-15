"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}

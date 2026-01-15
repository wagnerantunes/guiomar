"use client";

import { Toaster, toast } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <>
            <Toaster 
                position="top-right" 
                theme={theme as "light" | "dark" | "system"}
                richColors
                closeButton
                expand={true}
            />
            {children}
        </>
    );
}

export const useToast = () => {
    return { toast };
};

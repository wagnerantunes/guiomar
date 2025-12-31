import React from "react";

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    icon?: string;
}

export function AdminPageHeader({ title, subtitle, children, icon }: AdminPageHeaderProps) {
    return (
        <div className="h-20 border-b border-border flex items-center justify-between px-8 bg-background/80 backdrop-blur-md shrink-0 relative z-20">
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>
                )}
                <div>
                    <h1 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {children}
            </div>
        </div>
    );
}

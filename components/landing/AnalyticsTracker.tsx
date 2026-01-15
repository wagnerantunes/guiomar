"use client";

import { useEffect } from "react";

interface AnalyticsTrackerProps {
    siteId: string;
    postId?: string;
    type?: string;
}

export function AnalyticsTracker({ siteId, postId, type = "view" }: AnalyticsTrackerProps) {
    useEffect(() => {
        const track = async () => {
            try {
                await fetch("/api/analytics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        siteId,
                        postId,
                        type,
                        path: window.location.pathname,
                        referrer: document.referrer
                    }),
                });
            } catch (error) {
                console.error("Analytics error:", error);
            }
        };
        track();
    }, [siteId, postId, type]);

    return null;
}

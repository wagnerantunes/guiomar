import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { siteId, postId, type, path, referrer } = body;

        if (!siteId) {
            return NextResponse.json({ error: "siteId is required" }, { status: 400 });
        }

        const analytics = await prisma.analytics.create({
            data: {
                siteId,
                postId,
                type: type || "view",
                path: path || "/",
                referrer,
            },
        });

        return NextResponse.json(analytics, { status: 201 });
    } catch (error) {
        console.error("Error creating analytics:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get("siteId");
        const days = parseInt(searchParams.get("days") || "7");

        if (!siteId) {
            return NextResponse.json({ error: "siteId is required" }, { status: 400 });
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const analytics = await prisma.analytics.findMany({
            where: {
                siteId,
                date: {
                    gte: startDate,
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        // Group by day for the chart
        const grouped = analytics.reduce((acc: any, curr) => {
            const day = curr.date.toISOString().split("T")[0];
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json(grouped);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

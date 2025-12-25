import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function GET() {
    const session = await auth();

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session.user?.id },
    });

    if (!siteUser) {
        return new NextResponse("Site not found", { status: 404 });
    }

    const media = await prisma.media.findMany({
        where: { siteId: siteUser.siteId },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(media);
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const siteUser = await prisma.siteUser.findFirst({
            where: { userId: session.user?.id },
        });

        if (!siteUser) return new NextResponse("Site not found", { status: 404 });

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadsDir, filename);

        await writeFile(filePath, buffer);

        const media = await prisma.media.create({
            data: {
                filename: file.name,
                url: `/uploads/${filename}`,
                mimeType: file.type,
                size: file.size,
                siteId: siteUser.siteId,
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const media = await prisma.media.findUnique({
            where: { id },
        });

        if (!media) return NextResponse.json({ error: "Media not found" }, { status: 404 });

        // Delete from file system
        try {
            const filename = media.url.replace("/uploads/", "");
            const filePath = path.join(process.cwd(), "public", "uploads", filename);
            await unlink(filePath);
        } catch (err) {
            console.error("File deletion error (disk):", err);
            // Continue even if file is missing from disk
        }

        await prisma.media.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/admin-utils";

export async function GET() {
    let session, siteId;
    try {
        ({ session, siteId } = await getAdminSession());
    } catch (error: any) {
        return new NextResponse(error.message || "Unauthorized", { status: error.message === "Unauthorized" ? 401 : 404 });
    }

    const media = await prisma.media.findMany({
        where: { siteId: siteId },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(media);
}

export async function POST(request: NextRequest) {
    try {
        const { session, siteId } = await getAdminSession();

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Professional filename sanitization with best practices
        const sanitizeFilename = (filename: string): string => {
            // Extract file extension
            const lastDotIndex = filename.lastIndexOf('.');
            const name = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
            const ext = lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';

            // Transliterate common special characters to ASCII equivalents
            const transliterationMap: { [key: string]: string } = {
                'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
                'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
                'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
                'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
                'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
                'ç': 'c', 'ñ': 'n',
                'Á': 'A', 'À': 'A', 'Ã': 'A', 'Â': 'A', 'Ä': 'A',
                'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
                'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
                'Ó': 'O', 'Ò': 'O', 'Õ': 'O', 'Ô': 'O', 'Ö': 'O',
                'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
                'Ç': 'C', 'Ñ': 'N'
            };

            // Apply transliteration
            let sanitized = name.split('').map(char => transliterationMap[char] || char).join('');

            // Replace spaces and special chars with hyphens
            sanitized = sanitized
                .replace(/\s+/g, '-')           // Spaces to hyphens
                .replace(/[^\w\-]/g, '-')       // Special chars to hyphens
                .replace(/-+/g, '-')            // Multiple hyphens to single
                .replace(/^-+|-+$/g, '')        // Remove leading/trailing hyphens
                .toLowerCase();                 // Lowercase for consistency

            // Fallback if name becomes empty after sanitization
            if (!sanitized || sanitized.length === 0) {
                sanitized = 'file';
            }

            // Limit filename length (max 100 chars for name part)
            if (sanitized.length > 100) {
                sanitized = sanitized.substring(0, 100);
            }

            return sanitized + ext.toLowerCase();
        };

        const sanitizedFilename = sanitizeFilename(file.name);
        const timestamp = Date.now();
        const filename = `${timestamp}-${sanitizedFilename}`;

        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadsDir, filename);

        await writeFile(filePath, buffer);

        const media = await prisma.media.create({
            data: {
                filename: file.name,
                url: `/uploads/${filename}`,
                mimeType: file.type,
                size: file.size,
                siteId: siteId,
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
        const { siteId } = await getAdminSession();
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

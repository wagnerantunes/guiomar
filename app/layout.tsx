import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });

import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { domain: "renovamente-guiomarmelo.com.br" },
          { subdomain: "renovamente" }
        ]
      },
      select: {
        name: true,
        description: true,
        favicon: true,
      }
    });

    return {
      title: site?.name || "RenovaMente - Consultoria em Bem-Estar Corporativo",
      description: site?.description || "Consultoria em bem-estar corporativo que une técnica, cuidado e gestão humana.",
      icons: {
        icon: site?.favicon || "/favicon.ico",
      }
    };
  } catch (error) {
    return {
      title: "RenovaMente",
      description: "Consultoria em bem-estar corporativo.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={manrope.className}>{children}</body>
    </html>
  );
}

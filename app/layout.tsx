import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://renovamente-guiomarmelo.com.br';

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

    const title = site?.name || "RenovaMente - Consultoria em Bem-Estar Corporativo";
    const description = site?.description || "Consultoria em bem-estar corporativo que une técnica, cuidado e gestão humana.";
    const ogImage = `${baseUrl}/og-image.jpg`;

    return {
      title,
      description,
      icons: {
        icon: site?.favicon || "/favicon.ico",
      },
      openGraph: {
        title,
        description,
        url: baseUrl,
        siteName: "RenovaMente",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "pt_BR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      robots: {
        index: true,
        follow: true,
      }
    };
  } catch (error) {
    return {
      title: "RenovaMente",
      description: "Consultoria em bem-estar corporativo.",
    };
  }
}

import { Providers } from "@/components/Providers";
import { FloatingOrbs } from "@/components/ui/FloatingOrbs";
import { CustomCursor } from "@/components/ui/CustomCursor";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let fontTheme = "tech";
  try {
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { domain: "renovamente-guiomarmelo.com.br" },
          { subdomain: "renovamente" }
        ]
      },
      select: { settings: true }
    });
    fontTheme = (site?.settings as any)?.fontTheme || "tech";
  } catch (error) {
    console.error("Layout: Error fetching site settings", error);
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RenovaMente",
              "url": "https://renovamente-guiomarmelo.com.br",
              "logo": "https://renovamente-guiomarmelo.com.br/logo.png",
              "description": "Consultoria em bem-estar corporativo que une técnica, cuidado e gestão humana.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR"
              },
              "sameAs": [
                "https://www.instagram.com/renovamente"
              ]
            })
          }}
        />
      </head>
      <body className={`${jakarta.className} font-theme-${fontTheme}`}>
        <Providers>
          <FloatingOrbs />
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}

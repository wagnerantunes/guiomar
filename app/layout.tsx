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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let fontTheme = "tech";
  let integrations: any = {};

  try {
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { domain: "renovamente-guiomarmelo.com.br" },
          { subdomain: "renovamente" }
        ]
      },
      include: {
        siteSettings: {
          where: {
            key: "integrations_config"
          }
        }
      }
    });

    fontTheme = (site?.settings as any)?.fontTheme || "tech";

    const integrSetting = site?.siteSettings.find(s => s.key === "integrations_config");
    if (integrSetting) {
      integrations = JSON.parse(integrSetting.value as string);
    }
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

        {/* GOOGLE ANALYTICS */}
        {integrations.gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${integrations.gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${integrations.gaId}');
                `
              }}
            />
          </>
        )}

        {/* FACEBOOK PIXEL */}
        {integrations.fbPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${integrations.fbPixelId}');
                fbq('track', 'PageView');
              `
            }}
          />
        )}

        {/* CUSTOM HEAD SCRIPTS */}
        {integrations.customHead && (
          <script dangerouslySetInnerHTML={{ __html: integrations.customHead }} />
        )}

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
      <body className={`${manrope.className} font-theme-${fontTheme} font-sans`}>
        {/* CUSTOM BODY START SCRIPTS (e.g. GTM NoScript) */}
        {integrations.customBodyStart && (
          <div dangerouslySetInnerHTML={{ __html: integrations.customBodyStart }} />
        )}

        <Providers>
          <FloatingOrbs />
          {children}
        </Providers>

        {/* CUSTOM BODY END SCRIPTS */}
        {integrations.customBodyEnd && (
          <div dangerouslySetInnerHTML={{ __html: integrations.customBodyEnd }} />
        )}
      </body>
    </html>
  );
}

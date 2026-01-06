import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://renovamente-guiomarmelo.com.br';

  try {
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { domain: "renovamente-guiomarmelo.com.br" },
          { domain: "www.renovamente-guiomarmelo.com.br" },
          { subdomain: "renovamente" }
        ]
      },
      select: {
        name: true,
        description: true,
        favicon: true,
      }
    }) || await prisma.site.findFirst();

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
import Script from "next/script";

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
          { domain: "www.renovamente-guiomarmelo.com.br" },
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
    }) || await prisma.site.findFirst({
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
      const val = integrSetting.value;
      if (typeof val === 'string') {
        try {
          integrations = JSON.parse(val);
        } catch (e) {
          console.error("Layout: Error parsing integrations_config string", e);
        }
      } else if (val && typeof val === 'object') {
        integrations = val;
      }
      console.log("Layout: Loaded integrations for", site?.domain || "default", integrations);
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />

        {/* GOOGLE TAG MANAGER (HEAD) */}
        {integrations.gtmId && integrations.gtmId.startsWith('GTM-') && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${integrations.gtmId}');
              `
            }}
          />
        )}

        {/* GOOGLE ANALYTICS & ADS */}
        {(integrations.gaId || integrations.googleAdsId) && (
          <>
            <Script
              id="google-tag"
              strategy="afterInteractive"
              src={
                integrations.googleTagGateway
                  ? `/gtag/js?id=${integrations.gaId || integrations.googleAdsId}`
                  : `https://www.googletagmanager.com/gtag/js?id=${integrations.gaId || integrations.googleAdsId}`
              }
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  ${integrations.gaId ? `gtag('config', '${integrations.gaId}');` : ''}
                  ${integrations.googleAdsId ? `gtag('config', '${integrations.googleAdsId}');` : ''}
                `
              }}
            />
          </>
        )}

        {/* FACEBOOK PIXEL */}
        {integrations.fbPixelId && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
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

        {/* TIKTOK PIXEL */}
        {integrations.tiktokPixelId && (
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                  ttq.load('${integrations.tiktokPixelId}');
                  ttq.page();
                }(window, document, 'ttq');
              `
            }}
          />
        )}

        {/* CUSTOM HEAD SCRIPTS */}
        {integrations.customHead && (
          <Script
            id="custom-head-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: integrations.customHead.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '$1')
            }}
          />
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
        {/* GTM NOSCRIPT */}
        {integrations.gtmId && integrations.gtmId.startsWith('GTM-') && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${integrations.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {/* FACEBOOK PIXEL NOSCRIPT */}
        {integrations.fbPixelId && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${integrations.fbPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}

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

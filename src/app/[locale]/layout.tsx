import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "lenis/dist/lenis.css";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeScript } from "@/components/theme-script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Mascots } from "@/components/mascot";
import { CookieConsent } from "@/components/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Titre et description par défaut, dans la langue de la page
export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    // base des URL relatives (canonical, Open Graph) de toutes les pages
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
  };
}

// Une version statique du site par langue (/en, /fr)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Layout racine, par langue : <html lang>, polices, thème, header/footer communs.
// setRequestLocale : permet le rendu statique des pages dans chaque langue.
export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    // suppressHydrationWarning : le script ci-dessous peut poser data-theme avant l'hydratation
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* thème choisi appliqué avant le premier rendu (voir ThemeScript) */}
        <ThemeScript />
      </head>
      <body className="relative flex min-h-svh flex-col font-sans">
        <NextIntlClientProvider>
          <SmoothScroll />
          {/* communs à toutes les pages */}
          <Header />
          {children}
          <Footer />
          {/* une mascotte, petite et sombre, qui se promène sur toute la hauteur de la page (elle
              défile avec le contenu ; au-dessus du contenu, sous le header, sans bloquer les clics) */}
          <Mascots count={1} scale={0.6} dim className="absolute inset-0 z-40" />
          {/* bannière de consentement + Google Analytics, chargé seulement après accord */}
          <CookieConsent gaId={site.gaId} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

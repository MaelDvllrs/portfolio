import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // base des URL relatives (canonical, Open Graph) de toutes les pages
  metadataBase: new URL(site.url),
  title: "Maël Devillers — Fullstack Developer",
  description: "Fullstack developer building web products, SaaS and AI-powered experiences from idea to production.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : le script ci-dessous peut poser data-theme avant l'hydratation
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applique le thème choisi avant le premier rendu (évite un flash). Sans choix
            enregistré : pas d'attribut, le site suit le système. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-svh flex-col font-sans">
        <SmoothScroll />
        {/* communs à toutes les pages */}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

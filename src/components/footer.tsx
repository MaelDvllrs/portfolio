import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Logo } from "@/components/ui/logo";
import { SOCIAL_ICONS } from "@/components/ui/social-icons";
import { GlowWordmark } from "@/components/ui/glow-wordmark";
import { CookieSettingsButton } from "@/components/cookie-consent";

// Trois rangées (chacune sa ligne haute pleine largeur) :
// 1. logo à gauche, réseaux (icônes seules) à droite ;
// 2. nom + description à gauche, liens des pages à droite (en dessous, alignés à gauche, sur mobile) ;
// 3. copyright et liens légaux à gauche, choix du thème à droite ;
// puis « trymael » en très grand, en contour lumineux (lueur sous la souris, effet déclenché par
// tout le footer). Les rangées passent au-dessus de sa lumière (z-10) et le mot ne capte pas la
// souris (pointer-events-none) : les liens et le choix du thème restent cliquables.
export function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const hero = useTranslations("Hero");
  const pages = [
    { label: nav("home"), href: "/" },
    { label: nav("services"), href: "/services" },
    { label: nav("work"), href: "/work" },
    { label: nav("blog"), href: "/blog" },
    { label: nav("contact"), href: "/contact" },
  ];

  return (
    // overflow-x-clip : la lumière du mot peut sortir de la colonne, pas de l'écran (pas de scroll horizontal)
    <footer className="overflow-x-clip text-sm">
      <Frame as="div" className="relative z-10 flex items-center justify-between gap-6 py-3">
        <Link href="/" aria-label={site.name} className="flex items-center gap-2">
          <Logo className="h-7 w-auto" />
          <span className="text-base font-medium tracking-tight">trymael</span>
        </Link>
        <ul className="flex items-center gap-5">
          {site.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                aria-label={l.label}
                title={l.label}
                className="block text-muted transition-colors hover:text-foreground"
              >
                {SOCIAL_ICONS[l.label] ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                    <path d={SOCIAL_ICONS[l.label]} />
                  </svg>
                ) : (
                  l.label
                )}
              </a>
            </li>
          ))}
        </ul>
      </Frame>

      <Frame as="div" className="relative z-10 flex flex-wrap justify-between gap-8 py-6">
        <div className="max-w-xs">
          <p className="font-semibold">{site.name}</p>
          <p className="mt-1 text-muted">{hero.raw("bio")[0]}</p>
        </div>
        <nav aria-label={nav("footer")}>
          <ul className="flex flex-col items-start gap-2 sm:items-end">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-muted transition-colors hover:text-foreground">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Frame>

      <Frame as="div" className="relative z-10 flex items-center justify-between gap-6 py-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <p>{t("rights", { year: new Date().getFullYear(), name: site.name })}</p>
          <Link href="/legal-notice" className="transition-colors hover:text-foreground">
            {t("legalNotice")}
          </Link>
          <Link href="/privacy-policy" className="transition-colors hover:text-foreground">
            {t("privacy")}
          </Link>
          <CookieSettingsButton label={t("cookieSettings")} className="cursor-pointer transition-colors hover:text-foreground" />
        </div>
        <ThemeSwitch />
      </Frame>

      {/* coupé seulement par le bas (clip-path) : le bas des lettres (30 %) est masqué ; sur les côtés
          et en haut, l'extrusion lumineuse déborde librement de la colonne */}
      <Frame as="div" className="[clip-path:inset(-100vh_-100vw_0_-100vw)]">
        <GlowWordmark text="trymael" cropBottom={0.3} cropTop={0.12} trigger="footer" className="pointer-events-none select-none" />
      </Frame>
    </footer>
  );
}

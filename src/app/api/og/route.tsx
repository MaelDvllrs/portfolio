import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/components/ui/logo";

// Image de partage générée (Open Graph / Twitter, 1200×630) pour les pages sans photo :
// fond sombre du site, logo + « trymael » en haut, titre de la page en grand, sous-titre en dessous,
// domaine du site en bas. /api/og?title=…&subtitle=… (textes déjà traduits par la page).
// Sous /api : hors du proxy de langue. Les images sont mises en cache par le navigateur et les CDN.

const SIZE = { width: 1200, height: 630 };
const COLORS = { background: "#0c0a09", foreground: "#f5f5f4", muted: "#a8a29e", border: "#292524" };

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clip(searchParams.get("title")?.trim() || site.name, 90);
  const subtitle = clip(searchParams.get("subtitle")?.trim() ?? "", 160);
  const domain = site.url.replace(/^https?:\/\//, "");
  const logoHeight = 44;
  const logoWidth = (LOGO_VIEWBOX.width / LOGO_VIEWBOX.height) * logoHeight;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: COLORS.background,
          color: COLORS.foreground,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width={logoWidth} height={logoHeight} viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}>
            {LOGO_PATHS.map((d) => (
              <path key={d} d={d} fill={COLORS.foreground} />
            ))}
          </svg>
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>trymael</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 50 ? 60 : 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
            {title}
          </div>
          {subtitle && <div style={{ fontSize: 30, lineHeight: 1.35, color: COLORS.muted }}>{subtitle}</div>}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: COLORS.muted }}>
          <span>{site.name}</span>
          <span>{domain}</span>
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    },
  );
}

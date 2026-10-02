import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { CMS_TAGS } from "@/lib/cms";

// Appelée par le CMS (portfolio-cms) après une modification de contenu :
// invalide le cache des données concernées. Protégée par un secret partagé.
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tag } = (await request.json().catch(() => ({}))) as { tag?: string };
  const allowed = Object.values(CMS_TAGS) as string[];
  if (!tag || !allowed.includes(tag)) {
    return Response.json({ error: `Unknown tag. Expected one of: ${allowed.join(", ")}` }, { status: 400 });
  }

  // expire: 0 → la prochaine visite récupère directement les nouvelles données
  // (avec "max", la première visite après une modif servirait encore l'ancienne version)
  revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tag });
}

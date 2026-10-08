import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl : charge la configuration de langue de src/i18n/request.ts
const withNextIntl = createNextIntlPlugin();

// Domaines d'où next/image peut charger des images :
// - Supabase Storage (médias du CMS, bucket public) ;
// - le CMS lui-même (médias stockés en local, sans bucket configuré).
const cmsUrl = process.env.CMS_URL ? new URL(process.env.CMS_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      ...(cmsUrl
        ? [
            {
              protocol: cmsUrl.protocol.replace(":", "") as "http" | "https",
              hostname: cmsUrl.hostname,
              port: cmsUrl.port,
            },
          ]
        : []),
    ],
  },
};

export default withNextIntl(nextConfig);

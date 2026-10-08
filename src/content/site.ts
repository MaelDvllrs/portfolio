// Données du site qui ne dépendent pas de la langue (liens, identifiants, infos légales…).
// Les textes affichés sont dans messages/en.json et messages/fr.json (next-intl).
import atolLogo from "@/assets/image/logo-client/6a33a896555ec73bd8b311d3_atol.png";
import techAndFestLogo from "@/assets/image/logo-client/TECH-AND-FEST-LOGO-BLANC-RVB.avif";

export const site = {
  name: "Maël Devillers",
  email: "mael.devillers@gmail.com",
  // ID de mesure Google Analytics 4 (public par nature) : chargé seulement après consentement
  // (src/components/cookie-consent.tsx)
  gaId: "G-40DBM361V5",
  // Dépôt public du portfolio sur GitHub (bouton « Star » du header)
  repo: "MaelDvllrs/portfolio",
  // URL publique du site (liens canoniques, sitemap, Open Graph) : variable SITE_URL en production
  url: process.env.SITE_URL ?? "http://localhost:3000",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mael-devillers-b12a5b236" },
    { label: "GitHub", href: "https://github.com/MaelDvllrs" },
    { label: "X", href: "https://x.com/marl_2304" },
    { label: "Webflow", href: "https://webflow.com/@maeldvllrs" },
  ],

  // En-tête façon profil (src/components/sections/hero.tsx)
  profile: {
    name: "Mael",
    handle: "@trymael",
    timeZone: "Europe/Paris", // heure affichée à côté de la localisation
  },

  // Logos du bandeau ajoutés en statique (fichiers dans src/assets/image/logo-client).
  // Les logos venant du CMS (projets publiés, collection Clients) s'y ajoutent.
  clients: [
    { name: "Atol", logo: atolLogo },
    { name: "Tech and Fest", logo: techAndFestLogo },
  ],

  // Pages /legal-notice et /privacy-policy (obligatoires en France : identité et adresse de
  // l'éditeur, hébergeur). Éditeur particulier, sans activité déclarée : pas de statut ni de SIRET
  // (à ajouter dans `publisher` en cas de création d'entreprise).
  legal: {
    updated: "2026-10-08", // date de dernière mise à jour des deux pages
    publisher: {
      name: "Maël Devillers",
      address: "31 chemin du Manival, 38330 Saint-Ismier, France",
      // adresse publique affichée sur les pages légales (distincte de l'email de réception du formulaire)
      email: "marlholding.sas@gmail.com",
    },
    host: {
      name: "Vercel Inc.",
      address: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
      website: "https://vercel.com",
    },
  },

  work: {
    projects: [
      {
        name: "Wenoble Dashboard",
        description: "TODO — one sentence describing the product.",
        type: "SaaS",
        // TODO : période du projet
        startYear: null as number | null,
        endYear: null as number | null,
        ongoing: false,
        tools: ["Next.js", "TypeScript", "Supabase"],
        image: null as string | null, // TODO : image de fond de la card (16/9)
        logo: null as string | null, // TODO : logo du projet
        url: null as string | null, // TODO : lien externe du projet
      },
      {
        name: "AI Blog / RAG",
        description: "TODO — one sentence describing the product.",
        type: "AI",
        startYear: null as number | null,
        endYear: null as number | null,
        ongoing: false,
        tools: ["Next.js", "Claude"],
        image: null as string | null,
        logo: null as string | null,
        url: null as string | null,
      },
      {
        name: "Manifeste",
        description: "TODO — one sentence describing the product.",
        type: "Web",
        startYear: null as number | null,
        endYear: null as number | null,
        ongoing: false,
        tools: ["Next.js", "TypeScript"],
        image: null as string | null,
        logo: null as string | null,
        url: null as string | null,
      },
    ],
  },

  // Grille des contributions (src/components/sections/github.tsx)
  github: {
    username: "MaelDvllrs",
  },

};

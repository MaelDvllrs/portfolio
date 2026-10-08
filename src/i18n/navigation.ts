import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Liens et navigation qui gardent la langue courante (/en/… ou /fr/…) : à utiliser à la place de
// next/link et next/navigation pour les liens internes.
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } = createNavigation(routing);

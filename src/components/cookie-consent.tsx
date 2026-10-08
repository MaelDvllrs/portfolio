"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";

// Consentement aux cookies de mesure d'audience (Google Analytics), conforme aux règles de la CNIL :
// - GA n'est chargé qu'après « Accept » ; rien n'est déposé avant ni en cas de refus ;
// - « Decline » est aussi visible et facile que « Accept » (mêmes boutons) ;
// - le choix est gardé dans localStorage (6 mois, puis la question est reposée) et peut être changé
//   à tout moment via « Cookie settings » dans le footer (CookieSettingsButton) ;
// - retirer son accord supprime les cookies GA déjà déposés.

type Choice = "granted" | "denied";
const KEY = "cookie-consent";
const MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 mois
const OPEN_EVENT = "cookie-settings-open";
const CHANGE_EVENT = "cookie-consent-change";

let reopened = false; // bannière rouverte via « Cookie settings »

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { value, at } = JSON.parse(raw) as { value: Choice; at: number };
    return Date.now() - at < MAX_AGE ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(value: Choice) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
  } catch {
    // stockage indisponible (navigation privée stricte) : le choix vaut pour la session en cours
  }
}

// Supprime les cookies de Google Analytics (_ga, _ga_<id>) sur le domaine courant et ses parents
function clearGaCookies() {
  const names = document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga"));
  const parts = location.hostname.split(".");
  const domains = parts.map((_, i) => parts.slice(i).join("."));
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
  }
}

// État partagé : choix enregistré + bannière rouverte, lu via useSyncExternalStore
// (côté serveur : « pas encore lu », rien n'est affiché ni chargé)
type State = { choice: Choice | null; open: boolean };
let snapshot: State | null = null;
const read = (): State => {
  const choice = readChoice();
  const open = reopened || choice === null;
  if (!snapshot || snapshot.choice !== choice || snapshot.open !== open) snapshot = { choice, open };
  return snapshot;
};
const subscribe = (notify: () => void) => {
  const onOpen = () => {
    reopened = true;
    notify();
  };
  window.addEventListener(OPEN_EVENT, onOpen);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener(OPEN_EVENT, onOpen);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
};

export function CookieConsent({ gaId }: { gaId: string }) {
  const t = useTranslations("Cookies");
  const state = useSyncExternalStore(subscribe, read, () => null);

  const decide = (value: Choice) => {
    const previous = readChoice();
    saveChoice(value);
    reopened = false;
    window.dispatchEvent(new Event(CHANGE_EVENT));
    // accord retiré après coup : GA est déjà chargé dans la page → on nettoie et on recharge
    if (value === "denied" && previous === "granted") {
      clearGaCookies();
      location.reload();
    }
  };

  return (
    <>
      {state?.choice === "granted" && <GoogleAnalytics gaId={gaId} />}

      {state?.open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t("dialog")}
          className="fixed inset-x-0 bottom-0 z-50 px-2"
        >
          <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-3 border-x border-t border-border bg-background px-6 py-3 text-sm">
            <p className="max-w-md text-muted">
              {t("text")}{" "}
              <Link href="/privacy-policy" className="underline decoration-border underline-offset-4 hover:text-foreground">
                {t("learnMore")}
              </Link>
            </p>
            {/* mêmes boutons pour refuser et accepter (aucun choix mis en avant) */}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => decide("denied")}>
                {t("decline")}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => decide("granted")}>
                {t("accept")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Lien « Cookie settings » (footer) : rouvre la bannière pour changer son choix
// `label` : texte traduit, fourni par le footer (Server Component)
export function CookieSettingsButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      {label}
    </button>
  );
}

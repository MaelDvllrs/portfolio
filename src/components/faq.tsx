// FAQ en accordéon natif (<details>/<summary> : sans JavaScript, accessible au clavier).
// Pleine largeur de la section (cadre `bleed`) : lignes séparées par des bordures, texte
// au padding des sections (px-6) ; pas de bordure haute/basse (déjà celles du cadre).
// « + » qui pivote en « × » à l'ouverture ; ouverture animée via ::details-content
// (globals.css, navigateurs récents ; ailleurs, ouverture instantanée).
export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.question} className="group border-border not-last:border-b">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-3.5 text-[0.8125rem] font-medium text-foreground [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden
              className="size-3.5 shrink-0 text-muted transition duration-300 group-open:rotate-45 group-hover:text-foreground"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
          </summary>
          <p className="pr-14 pb-4 pl-6 text-sm leading-relaxed whitespace-pre-line text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

/** Données structurées schema.org FAQPage (à placer dans un <script type="application/ld+json">). */
export const faqJsonLd = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

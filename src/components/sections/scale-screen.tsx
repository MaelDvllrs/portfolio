// Écran de l'étape SCALE : une phrase en gros, mot par mot au fil du scroll.
// Chaque mot est un `data-anim="block"` (apparaît en montant), animé par le parent.

const SENTENCE = "And now, the real work starts.";

export function ScaleScreen() {
  return (
    <p className="text-center text-4xl leading-tight font-normal tracking-tight text-balance text-neutral-900 sm:text-5xl lg:text-6xl">
      {SENTENCE.split(" ").map((word, i) => (
        // l'espace reste hors du mot animé (inline-block) pour que le centrage soit exact
        <span key={i}>
          {i > 0 && " "}
          <span
            className="inline-block"
            style={{ opacity: 0, transform: "translateY(12px)" }}
            data-anim="block"
            data-duration={0.4}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}

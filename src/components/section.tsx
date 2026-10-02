import { Frame } from "@/components/frame";

// Style commun des titres de section (plus gros et plus fin)
export const h2Class = "text-4xl leading-tight font-normal tracking-tight text-balance sm:text-5xl";

export function Section({
  id,
  title,
  centered = false,
  spacious = false,
  className = "",
  children,
}: {
  id: string;
  title: string;
  /** Titre centré */
  centered?: boolean;
  /** Padding vertical plus généreux */
  spacious?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Frame id={id} className={`${spacious ? "py-32 sm:py-40" : "py-20"} ${className}`}>
      <h2 className={`${h2Class} ${centered ? "mb-16 text-center" : "mb-10"}`}>{title}</h2>
      {children}
    </Frame>
  );
}

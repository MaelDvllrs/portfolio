import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Logo } from "@/components/ui/logo";
import { Mascots } from "@/components/mascot";

// À gauche : logo, nom, rôle, puis le copyright en bas ; à droite : les réseaux en colonne,
// puis le choix du thème. Trois mascottes se promènent dans tout le footer (padding bas
// généreux pour leur laisser de la place).
export function Footer() {
  return (
    <Frame as="footer" className="relative flex justify-between gap-8 pt-10 pb-36 text-sm">
      {/* mascottes : se promènent dans tout le footer, sous le texte (z-0 / z-10) */}
      <Mascots count={3} />

      <div className="relative z-10 flex flex-col justify-between gap-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="text-base font-medium tracking-tight">trymael</span>
          </div>
          <p className="font-semibold">{site.name}</p>
          <p className="text-muted">{site.role}</p>
        </div>
        <p className="text-muted">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-end gap-8">
        <ul className="flex flex-col items-end gap-2">
          {site.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noreferrer" className="transition-colors duration-300 ease-out hover:text-muted">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeSwitch />
      </div>
    </Frame>
  );
}

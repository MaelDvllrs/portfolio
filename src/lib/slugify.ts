// « Wenoble Dashboard » → « wenoble-dashboard » (slugs des projets statiques, ancres des titres)
export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

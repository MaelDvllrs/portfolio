"use server";

import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";

// Envoi du formulaire de contact : validation, anti-spam, puis email via Resend.
// Le message arrive dans la boîte de CONTACT_TO (défaut : l'email du site), avec l'email du
// visiteur en « Répondre à » : répondre au mail répond directement au visiteur.
// Variables : RESEND_API_KEY (obligatoire), CONTACT_FROM (expéditeur sur un domaine vérifié
// dans Resend ; défaut : l'adresse de test de Resend), CONTACT_TO (optionnel).

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Erreurs par champ (affichées sous chaque champ) */
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Valeurs saisies, renvoyées pour ne pas vider le formulaire en cas d'erreur */
  values?: { name: string; email: string; message: string };
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // messages dans la langue de la page d'où le formulaire est envoyé (/en/contact ou /fr/contact)
  const t = await getTranslations("ContactForm");
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Pot de miel : champ invisible pour un humain ; s'il est rempli, c'est un robot.
  // On répond « envoyé » sans rien envoyer, pour ne pas lui donner d'indice.
  if (formData.get("website")) return { status: "success", message: t("success") };

  const errors: ContactState["errors"] = {};
  if (!values.name) errors.name = t("errors.name");
  else if (values.name.length > 120) errors.name = t("errors.nameLong");
  if (!EMAIL.test(values.email)) errors.email = t("errors.email");
  if (values.message.length < 10) errors.message = t("errors.messageShort");
  else if (values.message.length > 5000) errors.message = t("errors.messageLong");
  if (Object.keys(errors).length) {
    return { status: "error", message: t("errors.check"), errors, values };
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY manquant");

    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO ?? site.email,
      replyTo: values.email,
      subject: t("emailSubject", { name: values.name }),
      text: `${values.name} <${values.email}>\n\n${values.message}`,
      html:
        `<p><strong>${escapeHtml(values.name)}</strong> &lt;${escapeHtml(values.email)}&gt;</p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(values.message)}</p>`,
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (error) {
    console.error("[contact] Envoi du message impossible :", error);
    return {
      status: "error",
      message: t("errors.failed"),
      values,
    };
  }

  return { status: "success", message: t("success") };
}

"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";

const initialState: ContactState = { status: "idle", message: "" };

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted/70 focus:border-foreground/40 focus:outline-none aria-invalid:border-red-500/60";

// Formulaire de contact : nom, email, message. Envoi par server action (sendMessage), avec
// erreurs par champ et message de confirmation. Après un envoi réussi, le formulaire est
// remplacé par la confirmation.
export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);

  if (state.status === "success") {
    return (
      <p role="status" className="py-10 text-center text-sm">
        {state.message}
      </p>
    );
  }

  return (
    // key : remet les valeurs renvoyées par le serveur dans les champs après une erreur
    <form key={JSON.stringify(state.values ?? {})} action={formAction} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.errors?.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            defaultValue={state.values?.name}
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            className={fieldClass}
          />
        </Field>
        <Field label="Email" name="email" error={state.errors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email}
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            className={fieldClass}
          />
        </Field>
      </div>

      <Field label="Message" name="message" error={state.errors?.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          placeholder="Tell me about your project…"
          defaultValue={state.values?.message}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      {/* pot de miel anti-spam : caché aux humains (et aux lecteurs d'écran), rempli par les robots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className={`text-sm ${state.status === "error" ? "text-red-500" : "text-muted"}`}>
          {state.status === "error" ? state.message : ""}
        </p>
        <Button type="submit" variant="primary" disabled={pending} className="ml-auto">
          {pending ? "Sending…" : "Send message"}
          {!pending && <ArrowIcon />}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

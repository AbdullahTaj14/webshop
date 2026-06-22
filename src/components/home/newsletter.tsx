"use client";

import { useActionState } from "react";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter, type NewsletterState } from "@/actions/newsletter";

const initialState: NewsletterState = { status: "idle" };

export function Newsletter() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <section id="newsletter" className="py-20 lg:py-28">
      <Container size="content">
        <div className="flex flex-col items-center rounded-3xl bg-foreground px-6 py-16 text-center sm:px-16 sm:py-20">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-background sm:text-4xl">
            Join the list.
          </h2>
          <p className="mt-3 max-w-md text-balance text-secondary sm:text-lg">
            Early access to new releases, restocks, and the occasional essay on why we made
            something the way we did.
          </p>

          <form
            action={formAction}
            className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            noValidate
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="bg-background"
              aria-describedby="newsletter-status"
            />
            <Button type="submit" size="lg" loading={pending} className="shrink-0">
              Subscribe
            </Button>
          </form>

          <p
            id="newsletter-status"
            role="status"
            aria-live="polite"
            className={
              state.status === "error"
                ? "mt-3 text-sm text-error"
                : "mt-3 text-sm text-background/70"
            }
          >
            {state.message}
          </p>
        </div>
      </Container>
    </section>
  );
}

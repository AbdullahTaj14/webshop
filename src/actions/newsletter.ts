"use server";

import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const result = schema.safeParse({ email: formData.get("email") });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message ?? "Invalid email." };
  }

  // Mock subscription — a real implementation would call an email
  // platform's API (Klaviyo, Mailchimp, etc.) here.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { status: "success", message: "You're on the list. Welcome to Aro." };
}

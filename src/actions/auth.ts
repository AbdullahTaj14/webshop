"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "aro_session";

export interface AuthState {
  status: "idle" | "error";
  message?: string;
}

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, result.data.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/account");
}

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const result = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, result.data.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/account");
}

export interface ForgotPasswordState {
  status: "idle" | "error" | "success";
  message?: string;
}

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const result = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message };
  }

  // Mock — a real implementation would send a reset email here.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    status: "success",
    message: `If an account exists for ${result.data.email}, a reset link is on its way.`,
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

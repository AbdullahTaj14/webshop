"use server";

import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional(),
});

export interface ProfileState {
  status: "idle" | "error" | "success";
  message?: string;
}

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const result = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message };
  }

  // Mock — a real implementation would persist this to a user record.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { status: "success", message: "Profile updated." };
}

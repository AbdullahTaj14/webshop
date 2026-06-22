import type { Metadata } from "next";
import { ProfileForm } from "@/components/account/profile-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await getSession();

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Profile</h2>
      <p className="mt-1.5 text-sm text-secondary">Manage your personal information.</p>
      <div className="mt-8">
        <ProfileForm email={session?.email ?? ""} />
      </div>
    </div>
  );
}

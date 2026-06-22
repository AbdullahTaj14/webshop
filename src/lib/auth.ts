import "server-only";
import { cookies } from "next/headers";

export interface Session {
  email: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get("aro_session")?.value;
  return email ? { email } : null;
}

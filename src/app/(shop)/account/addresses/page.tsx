import type { Metadata } from "next";
import { AddressesContent } from "@/components/account/addresses-content";

export const metadata: Metadata = {
  title: "Addresses",
};

export default function AddressesPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Saved addresses</h2>
      <div className="mt-6">
        <AddressesContent />
      </div>
    </div>
  );
}

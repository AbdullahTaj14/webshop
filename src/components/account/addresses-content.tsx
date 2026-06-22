"use client";

import * as React from "react";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddressesStore } from "@/store/addresses-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";

export function AddressesContent() {
  const hasHydrated = useHasHydrated(useAddressesStore.persist);
  const [open, setOpen] = React.useState(false);
  const addresses = useAddressesStore((s) => s.addresses);
  const addAddress = useAddressesStore((s) => s.addAddress);
  const removeAddress = useAddressesStore((s) => s.removeAddress);
  const setDefault = useAddressesStore((s) => s.setDefault);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    addAddress({
      label: String(form.get("label") || "Address"),
      fullName: String(form.get("fullName") || ""),
      line1: String(form.get("line1") || ""),
      city: String(form.get("city") || ""),
      state: String(form.get("state") || ""),
      postalCode: String(form.get("postalCode") || ""),
      country: String(form.get("country") || ""),
      phone: String(form.get("phone") || ""),
      isDefault: addresses.length === 0,
    });
    setOpen(false);
  }

  if (!hasHydrated) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary">Saved shipping addresses.</p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 py-12 text-center">
          <MapPin className="size-10 text-muted" strokeWidth={1.25} />
          <p className="text-sm text-secondary">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{address.label}</p>
                {address.isDefault && (
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Star className="size-3 fill-current" />
                    Default
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-secondary">
                {address.fullName}
                <br />
                {address.line1}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
              </p>
              <div className="mt-4 flex items-center gap-4">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(address.id)}
                    className="text-xs font-medium text-foreground hover:underline"
                  >
                    Set as default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAddress(address.id)}
                  aria-label={`Remove ${address.label}`}
                  className="ml-auto text-muted transition-colors hover:text-error"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onOpenChange={setOpen} title="Add address">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" name="label" placeholder="Home, Office…" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="line1">Address</Label>
            <Input id="line1" name="line1" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" name="postalCode" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue="United States" required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <Button type="submit" className="mt-2">
            Save address
          </Button>
        </form>
      </Modal>
    </div>
  );
}

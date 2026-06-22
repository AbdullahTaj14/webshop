"use client";

import * as React from "react";
import { CreditCard, Plus, Star, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentMethodsStore } from "@/store/payment-methods-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";

const brandLabels: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
  paypal: "PayPal",
};

export function PaymentMethodsContent() {
  const hasHydrated = useHasHydrated(usePaymentMethodsStore.persist);
  const [open, setOpen] = React.useState(false);
  const methods = usePaymentMethodsStore((s) => s.methods);
  const addMethod = usePaymentMethodsStore((s) => s.addMethod);
  const removeMethod = usePaymentMethodsStore((s) => s.removeMethod);
  const setDefault = usePaymentMethodsStore((s) => s.setDefault);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const cardNumber = String(form.get("cardNumber") || "");
    addMethod({
      brand: "visa",
      last4: cardNumber.slice(-4).padStart(4, "0"),
      expiry: String(form.get("expiry") || ""),
      isDefault: methods.length === 0,
    });
    setOpen(false);
  }

  if (!hasHydrated) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary">Saved payment methods.</p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add card
        </Button>
      </div>

      {methods.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 py-12 text-center">
          <CreditCard className="size-10 text-muted" strokeWidth={1.25} />
          <p className="text-sm text-secondary">No saved payment methods yet.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {methods.map((method) => (
            <div key={method.id} className="rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="size-4 text-secondary" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground">
                    {brandLabels[method.brand]} •••• {method.last4}
                  </p>
                </div>
                {method.isDefault && (
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Star className="size-3 fill-current" />
                    Default
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-secondary">Expires {method.expiry}</p>
              <div className="mt-4 flex items-center gap-4">
                {!method.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(method.id)}
                    className="text-xs font-medium text-foreground hover:underline"
                  >
                    Set as default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeMethod(method.id)}
                  aria-label="Remove card"
                  className="ml-auto text-muted transition-colors hover:text-error"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onOpenChange={setOpen} title="Add card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cardNumber">Card number</Label>
            <Input id="cardNumber" name="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="expiry">Expiry</Label>
              <Input id="expiry" name="expiry" placeholder="MM/YY" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" name="cvc" inputMode="numeric" placeholder="CVC" required />
            </div>
          </div>
          <Button type="submit" className="mt-2">
            Save card
          </Button>
        </form>
      </Modal>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCheckoutStore } from "@/store/checkout-store";
import { useCartStore } from "@/store/cart-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { shippingInfoSchema } from "@/lib/checkout-schemas";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 150;

const shippingOptions = [
  { value: "standard", label: "Standard", description: "5–7 business days", price: 8 },
  { value: "express", label: "Express", description: "2–3 business days", price: 18 },
  { value: "overnight", label: "Overnight", description: "Next business day", price: 35 },
] as const;

export function ShippingForm() {
  const hasHydrated = useHasHydrated(useCheckoutStore.persist);
  if (!hasHydrated) return null;
  return <ShippingFormInner />;
}

function ShippingFormInner() {
  const router = useRouter();
  // Snapshot once on mount — hydration has already completed (no SSR
  // mismatch risk), and a reactive subscription would re-fire this guard
  // if customer is ever cleared (e.g. resetCheckout on order success)
  // while this component is still mounted during a route transition.
  const [customer] = React.useState(() => useCheckoutStore.getState().customer);
  const [shipping] = React.useState(() => useCheckoutStore.getState().shipping);
  const setShipping = useCheckoutStore((s) => s.setShipping);
  const subtotal = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity * i.product.price, 0));

  React.useEffect(() => {
    if (!customer) router.replace("/checkout/information");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [values, setValues] = React.useState({
    address: shipping?.address ?? "",
    apartment: shipping?.apartment ?? "",
    city: shipping?.city ?? "",
    state: shipping?.state ?? "",
    postalCode: shipping?.postalCode ?? "",
    country: shipping?.country ?? "United States",
    method: shipping?.method ?? "standard",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = shippingInfoSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setShipping(result.data);
    router.push("/checkout/payment");
  }

  if (!customer) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Shipping address</h1>

      <Field
        id="address"
        label="Address"
        value={values.address}
        error={errors.address}
        onChange={(v) => setValues((s) => ({ ...s, address: v }))}
        autoComplete="address-line1"
      />
      <Field
        id="apartment"
        label="Apartment, suite, etc. (optional)"
        value={values.apartment}
        onChange={(v) => setValues((s) => ({ ...s, apartment: v }))}
        autoComplete="address-line2"
      />

      <div className="grid grid-cols-2 gap-4">
        <Field
          id="city"
          label="City"
          value={values.city}
          error={errors.city}
          onChange={(v) => setValues((s) => ({ ...s, city: v }))}
          autoComplete="address-level2"
        />
        <Field
          id="state"
          label="State"
          value={values.state}
          error={errors.state}
          onChange={(v) => setValues((s) => ({ ...s, state: v }))}
          autoComplete="address-level1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          id="postalCode"
          label="Postal code"
          value={values.postalCode}
          error={errors.postalCode}
          onChange={(v) => setValues((s) => ({ ...s, postalCode: v }))}
          autoComplete="postal-code"
        />
        <Field
          id="country"
          label="Country"
          value={values.country}
          error={errors.country}
          onChange={(v) => setValues((s) => ({ ...s, country: v }))}
          autoComplete="country-name"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Shipping method</p>
        <RadioGroup
          value={values.method}
          onValueChange={(v) => setValues((s) => ({ ...s, method: v as typeof s.method }))}
        >
          {shippingOptions.map((option) => {
            const isFree = option.value === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD;
            return (
              <label
                key={option.value}
                htmlFor={`method-${option.value}`}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-border px-4 py-3.5 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={option.value} id={`method-${option.value}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{option.label}</p>
                    <p className="text-xs text-muted">{option.description}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {isFree ? "Free" : formatPrice(option.price)}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => router.push("/checkout/information")}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" size="lg">
          Continue to payment
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={Boolean(error)}
        autoComplete={autoComplete}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

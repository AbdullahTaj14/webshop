"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCheckoutStore } from "@/store/checkout-store";
import { useCartStore } from "@/store/cart-store";
import { useOrdersStore } from "@/store/orders-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { cardPaymentSchema } from "@/lib/checkout-schemas";
import { placeOrder } from "@/actions/checkout";
import { availablePaymentProviders } from "@/services/payment";
import type { PaymentProviderId } from "@/types/order";
import { cn } from "@/lib/utils";

export function PaymentForm() {
  const hasHydrated = useHasHydrated(useCheckoutStore.persist);
  if (!hasHydrated) return null;
  return <PaymentFormInner />;
}

function PaymentFormInner() {
  const router = useRouter();
  // Read once for the initial render — hydration has already completed (no
  // SSR mismatch risk), and re-reading reactively would fire this guard
  // again when resetCheckout() clears these on a successful order,
  // bouncing the user away right as we navigate to the confirmation page.
  const [customer] = React.useState(() => useCheckoutStore.getState().customer);
  const [shipping] = React.useState(() => useCheckoutStore.getState().shipping);
  const resetCheckout = useCheckoutStore((s) => s.reset);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrdersStore((s) => s.addOrder);

  React.useEffect(() => {
    if (!customer) router.replace("/checkout/information");
    else if (!shipping) router.replace("/checkout/shipping");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [provider, setProvider] = React.useState<PaymentProviderId>("stripe");
  const [card, setCard] = React.useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitError, setSubmitError] = React.useState<string | undefined>();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer || !shipping) return;

    if (provider === "stripe") {
      const result = cardPaymentSchema.safeParse(card);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const key = issue.path[0];
          if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }
    setErrors({});
    setSubmitError(undefined);
    setPending(true);

    const result = await placeOrder({
      customer,
      shipping,
      payment: { provider, ...card },
      items: items.map((item) => ({
        productSlug: item.product.slug,
        name: item.product.name,
        brand: item.product.brand,
        price: item.product.price,
        currency: item.product.currency,
        quantity: item.quantity,
        color: item.variant.color,
        size: item.variant.size,
        imageTone: item.product.images[0].tone,
        imageToneDark: item.product.images[0].toneDark,
        imageIcon: item.product.images[0].icon,
      })),
    });

    setPending(false);

    if (!result.success || !result.order) {
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    addOrder(result.order);
    clearCart();
    resetCheckout();
    router.push(`/order-confirmation/${result.order.id}`);
  }

  if (!customer || !shipping) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Payment</h1>

      <RadioGroup value={provider} onValueChange={(v) => setProvider(v as PaymentProviderId)}>
        {availablePaymentProviders.map((p) => (
          <label
            key={p.id}
            htmlFor={`provider-${p.id}`}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3.5 transition-colors hover:border-border-strong",
              provider === p.id && "border-foreground"
            )}
          >
            <RadioGroupItem value={p.id} id={`provider-${p.id}`} />
            <CreditCard className="size-4 text-secondary" strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground">{p.label}</span>
          </label>
        ))}
      </RadioGroup>

      {provider === "stripe" ? (
        <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
          <Field
            id="cardholderName"
            label="Cardholder name"
            value={card.cardholderName}
            error={errors.cardholderName}
            onChange={(v) => setCard((s) => ({ ...s, cardholderName: v }))}
            autoComplete="cc-name"
          />
          <Field
            id="cardNumber"
            label="Card number"
            value={card.cardNumber}
            error={errors.cardNumber}
            onChange={(v) => setCard((s) => ({ ...s, cardNumber: v }))}
            autoComplete="cc-number"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              id="expiry"
              label="Expiry"
              value={card.expiry}
              error={errors.expiry}
              onChange={(v) => setCard((s) => ({ ...s, expiry: v }))}
              autoComplete="cc-exp"
              placeholder="MM/YY"
            />
            <Field
              id="cvc"
              label="Security code"
              value={card.cvc}
              error={errors.cvc}
              onChange={(v) => setCard((s) => ({ ...s, cvc: v }))}
              autoComplete="cc-csc"
              inputMode="numeric"
              placeholder="CVC"
            />
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-border bg-foreground/5 px-4 py-3.5 text-sm text-secondary">
          You&rsquo;ll be redirected to {availablePaymentProviders.find((p) => p.id === provider)?.label} to
          complete your payment securely.
        </p>
      )}

      {submitError && <p className="text-sm text-error">{submitError}</p>}

      <div className="mt-2 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => router.push("/checkout/shipping")}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" size="lg" loading={pending}>
          <Lock className="size-4" />
          Place order
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
  inputMode,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
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
        inputMode={inputMode}
        placeholder={placeholder}
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

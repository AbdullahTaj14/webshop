"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCheckoutStore } from "@/store/checkout-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { customerInfoSchema } from "@/lib/checkout-schemas";

export function InformationForm() {
  const hasHydrated = useHasHydrated(useCheckoutStore.persist);
  if (!hasHydrated) return null;
  return <InformationFormInner />;
}

function InformationFormInner() {
  const router = useRouter();
  const setCustomer = useCheckoutStore((s) => s.setCustomer);
  // Hydration has already completed by the time this mounts, so reading
  // the snapshot once here is safe — no SSR/first-paint mismatch risk.
  const [values, setValues] = React.useState(() => {
    const customer = useCheckoutStore.getState().customer;
    return {
      email: customer?.email ?? "",
      firstName: customer?.firstName ?? "",
      lastName: customer?.lastName ?? "",
      phone: customer?.phone ?? "",
    };
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = customerInfoSchema.safeParse(values);
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
    setCustomer(result.data);
    router.push("/checkout/shipping");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Contact information
      </h1>

      <Field
        id="email"
        label="Email"
        type="email"
        value={values.email}
        error={errors.email}
        onChange={(v) => setValues((s) => ({ ...s, email: v }))}
        autoComplete="email"
      />

      <div className="grid grid-cols-2 gap-4">
        <Field
          id="firstName"
          label="First name"
          value={values.firstName}
          error={errors.firstName}
          onChange={(v) => setValues((s) => ({ ...s, firstName: v }))}
          autoComplete="given-name"
        />
        <Field
          id="lastName"
          label="Last name"
          value={values.lastName}
          error={errors.lastName}
          onChange={(v) => setValues((s) => ({ ...s, lastName: v }))}
          autoComplete="family-name"
        />
      </div>

      <Field
        id="phone"
        label="Phone"
        type="tel"
        value={values.phone}
        error={errors.phone}
        onChange={(v) => setValues((s) => ({ ...s, phone: v }))}
        autoComplete="tel"
      />

      <Button type="submit" size="lg" className="mt-2 self-end">
        Continue to shipping
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
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

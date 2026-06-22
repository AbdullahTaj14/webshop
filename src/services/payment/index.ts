import type { PaymentProviderId } from "@/types/order";
import type { PaymentProvider } from "./types";
import { stripeProvider } from "./providers/stripe";
import { paypalProvider } from "./providers/paypal";
import { applePayProvider } from "./providers/apple-pay";
import { googlePayProvider } from "./providers/google-pay";

const providers: Record<PaymentProviderId, PaymentProvider> = {
  stripe: stripeProvider,
  paypal: paypalProvider,
  "apple-pay": applePayProvider,
  "google-pay": googlePayProvider,
};

export function getPaymentProvider(id: PaymentProviderId): PaymentProvider {
  return providers[id];
}

export const availablePaymentProviders = Object.values(providers);

export type { PaymentProvider, PaymentIntentInput, PaymentIntentResult } from "./types";

import type { PaymentProviderId } from "@/types/order";

export interface PaymentIntentInput {
  amount: number;
  currency: string;
}

export interface PaymentIntentResult {
  id: string;
  provider: PaymentProviderId;
  status: "succeeded" | "failed";
  last4?: string;
}

export interface PaymentProvider {
  id: PaymentProviderId;
  label: string;
  /**
   * Mock implementation — real integrations would call out to the
   * provider's SDK/API here using server-only credentials.
   */
  charge(input: PaymentIntentInput): Promise<PaymentIntentResult>;
}

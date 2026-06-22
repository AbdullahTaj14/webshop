import type { PaymentIntentInput, PaymentIntentResult, PaymentProvider } from "../types";

export const stripeProvider: PaymentProvider = {
  id: "stripe",
  label: "Card (Stripe)",
  async charge(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    void input;
    return {
      id: `pi_mock_${Math.random().toString(36).slice(2, 11)}`,
      provider: "stripe",
      status: "succeeded",
      last4: "4242",
    };
  },
};

import type { PaymentIntentInput, PaymentIntentResult, PaymentProvider } from "../types";

export const paypalProvider: PaymentProvider = {
  id: "paypal",
  label: "PayPal",
  async charge(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    void input;
    return {
      id: `pp_mock_${Math.random().toString(36).slice(2, 11)}`,
      provider: "paypal",
      status: "succeeded",
    };
  },
};

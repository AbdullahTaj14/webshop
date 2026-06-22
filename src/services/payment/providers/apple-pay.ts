import type { PaymentIntentInput, PaymentIntentResult, PaymentProvider } from "../types";

export const applePayProvider: PaymentProvider = {
  id: "apple-pay",
  label: "Apple Pay",
  async charge(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    void input;
    return {
      id: `ap_mock_${Math.random().toString(36).slice(2, 11)}`,
      provider: "apple-pay",
      status: "succeeded",
    };
  },
};

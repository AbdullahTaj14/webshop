import type { PaymentIntentInput, PaymentIntentResult, PaymentProvider } from "../types";

export const googlePayProvider: PaymentProvider = {
  id: "google-pay",
  label: "Google Pay",
  async charge(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    void input;
    return {
      id: `gp_mock_${Math.random().toString(36).slice(2, 11)}`,
      provider: "google-pay",
      status: "succeeded",
    };
  },
};

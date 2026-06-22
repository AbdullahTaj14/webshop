export interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "paypal";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarTone: string;
}

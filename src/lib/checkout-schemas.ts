import { z } from "zod";

export const customerInfoSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
});

export const shippingInfoSchema = z.object({
  address: z.string().trim().min(1, "Address is required."),
  apartment: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().min(1, "State is required."),
  postalCode: z.string().trim().min(3, "Postal code is required."),
  country: z.string().trim().min(1, "Country is required."),
  method: z.enum(["standard", "express", "overnight"]),
});

export const cardPaymentSchema = z.object({
  cardholderName: z.string().trim().min(1, "Cardholder name is required."),
  cardNumber: z
    .string()
    .trim()
    .min(13, "Enter a valid card number.")
    .max(19, "Enter a valid card number."),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format."),
  cvc: z.string().trim().min(3, "Enter a valid security code.").max(4),
});

export const orderItemSchema = z.object({
  productSlug: z.string(),
  name: z.string(),
  brand: z.string(),
  price: z.number().nonnegative(),
  currency: z.string(),
  quantity: z.number().int().min(1),
  color: z.string().optional(),
  size: z.string().optional(),
  imageTone: z.string(),
  imageToneDark: z.string(),
  imageIcon: z.string(),
});

export const orderInputSchema = z.object({
  customer: customerInfoSchema,
  shipping: shippingInfoSchema,
  payment: z.object({
    provider: z.enum(["stripe", "paypal", "apple-pay", "google-pay"]),
    cardholderName: z.string().trim().optional(),
    cardNumber: z.string().trim().optional(),
    expiry: z.string().trim().optional(),
    cvc: z.string().trim().optional(),
  }),
  items: z.array(orderItemSchema).min(1, "Your cart is empty."),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

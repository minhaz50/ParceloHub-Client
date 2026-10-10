import { z } from "zod";

const addressSchema = z.object({
  line1: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(2, "City is required"),
  zoneId: z.string().min(1, "Please select a zone"),
  contactName: z.string().min(2, "Contact name is required"),
  contactPhone: z.string().min(11, "Enter a valid phone number").max(11),
});

// Split by wizard step so each step can validate independently.
export const senderStepSchema = z.object({ senderAddress: addressSchema });
export const receiverStepSchema = z.object({ receiverAddress: addressSchema });
export const parcelStepSchema = z.object({
  weightKg: z.coerce
    .number()
    .positive("Weight must be greater than 0")
    .max(1000, "Max 1000kg"),
  declaredValue: z.coerce.number().nonnegative().optional(),
  codAmount: z.coerce.number().nonnegative().optional(),
  serviceLevel: z.enum(["STANDARD", "EXPRESS", "SAME_DAY"]),
  description: z.string().optional(),
});
export const paymentStepSchema = z.object({
  paymentMethod: z.enum(["COD", "CARD", "MOBILE_BANKING"], {
    message:
      "Cash on Delivery alone isn't accepted for this demo — choose Card or Mobile Banking to test the real payment flow, or COD if you intend to pay on delivery.",
  }),
});

export const createShipmentSchema = senderStepSchema
  .merge(receiverStepSchema)
  .merge(parcelStepSchema)
  .merge(paymentStepSchema);

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;

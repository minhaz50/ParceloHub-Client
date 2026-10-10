import type { Metadata } from "next";
import { PaymentSuccessContentWrapper } from "./success-content";

export const metadata: Metadata = { title: "Payment Successful" };

export default function PaymentSuccessPage() {
  return <PaymentSuccessContentWrapper />;
}

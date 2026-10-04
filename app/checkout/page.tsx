import CheckoutClient from "./CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | MW Trends",
  robots: "noindex, nofollow" // Phase 6 Requirement: Do not index checkout
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

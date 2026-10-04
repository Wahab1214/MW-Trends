import ConfirmationClient from "./ConfirmationClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | MW Trends",
  robots: "noindex, nofollow"
};

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  // Required in Next.js 15: await dynamic route params in server component
  const resolvedParams = await params;
  return <ConfirmationClient orderId={resolvedParams.id} />;
}

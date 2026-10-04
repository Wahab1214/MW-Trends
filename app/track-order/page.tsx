import TrackingClient from "./TrackingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order | MW Trends",
};

export default function TrackOrderPage() {
  return <TrackingClient />;
}

"use client";

import { useEffect } from "react";
import { usePageTracking, analytics } from "./eventBus";

export default function AnalyticsTracker() {
  // Mount tracking, initialize with simulated consent
  useEffect(() => {
    // In real app, check localStorage for consent flag
    analytics.initialize(true); 
  }, []);

  usePageTracking();

  return null;
}

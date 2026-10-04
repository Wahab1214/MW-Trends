"use client";

/**
 * MW Trends Analytics Event Bus
 * 
 * Rules:
 * 1. All tracking goes through this singleton.
 * 2. Strict PII redaction happens here before external transmission.
 * 3. Consent awareness gates the actual dispatching of events.
 */

export type EventName = 
  | 'page_view'
  | 'view_item'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'enter_mw_world'
  | 'interact_living_poster'
  | 'open_custom_lab';

export interface AnalyticsPayload {
  [key: string]: any;
}

class EventBus {
  private consentGranted: boolean = false;
  private queue: { name: EventName; payload: AnalyticsPayload; timestamp: number }[] = [];

  // In a real app, this initializes based on cookie/localstorage consent flags
  initialize(consent: boolean) {
    this.consentGranted = consent;
    if (consent) {
      this.flushQueue();
    }
  }

  track(name: EventName, rawPayload: AnalyticsPayload = {}) {
    const timestamp = Date.now();
    const safePayload = this.redactPII(rawPayload);

    if (!this.consentGranted) {
      // Queue for when/if consent is granted during the session
      this.queue.push({ name, payload: safePayload, timestamp });
      return;
    }

    this.dispatch(name, safePayload, timestamp);
  }

  private redactPII(payload: AnalyticsPayload): AnalyticsPayload {
    const safe = { ...payload };
    // Explicitly strip sensitive fields
    delete safe.email;
    delete safe.phone;
    delete safe.address;
    delete safe.fullName;
    delete safe.password;
    delete safe.artworkUrl; // Ensure custom artwork urls don't leak
    delete safe.privateText; // Don't leak custom text typed into Custom Lab

    return safe;
  }

  private dispatch(name: EventName, payload: AnalyticsPayload, timestamp: number) {
    // 1. Send to internal mock console for observability
    console.log(`[Analytics Event] ${name} at ${new Date(timestamp).toISOString()}`, payload);

    // 2. Here we would dispatch to external adapters (GA4, Meta CAPI, etc.)
    // e.g. window.gtag('event', name, payload);
    // e.g. fbq('track', name, payload);
  }

  private flushQueue() {
    this.queue.forEach(event => {
      this.dispatch(event.name, event.payload, event.timestamp);
    });
    this.queue = [];
  }
}

export const analytics = new EventBus();

// Hook for easy use in functional components
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.track('page_view', { path: pathname });
  }, [pathname]);
}

# MW Trends - ChatGPT Handoff Document

This document contains the exact current state of the "MW Trends" prototype. Provide this document to ChatGPT to give it full context of the project so you can continue development seamlessly.

## 1. Project Overview & Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (used extensively for UI transitions)
- **3D Engine:** React Three Fiber (R3F) & @react-three/drei
- **State Management:** Zustand (for Cart, Customizer, and World states)
- **Backend/DB:** Supabase
- **Current Goal:** Transform a dark, minimal prototype into a visually rich, cinematic, premium digital world/bazaar.

## 2. What is Already Done (DO NOT REWRITE THESE)
- **Landing Experience (`components/ui/LandingExperience.tsx`):** 
  - We have successfully locked a **Pure Coded HTML/CSS/Framer Motion 2.5D Landing Page**.
  - No background images are pasted. It uses multi-layered DOM depth.
  - **Left/Right Walls:** Architectural gradient walls with stone block details and ambient wall lights.
  - **Pathway:** 3D rotated floor (`rotateX(80deg)`) with gold perspective lines pulling the user toward the gate.
  - **Gate & Crest:** A massive dark-metal gate with thick gold edges. The official logo (`/mw-logo-new.jpg`) is mounted into a physical circular architectural plate in the center.
  - **Animation:** Clicking the button triggers a cinematic sequence where the gate physically tears open (doors slide left and right), the ambient fog lifts revealing the glowing shops behind the gate, and the camera scales forward before routing to the next page.
  - The landing is fully isolated from SSR hydration errors (`dynamic` import with `ssr: false`).
- **Hydration Errors:** Fixed across the app (especially `MiniCart.tsx` using an `isMounted` pattern).

## 3. What Needs to be Built Next (MW Plaza)
The next immediate task is **Phase 2: MW Plaza**.
Once the user clicks "Enter MW World" on the landing page, they route into the 3D world (or a cinematic 2.5D world, depending on instructions).
- **Core Component:** `components/world/Plaza.tsx` and `components/world/WorldCanvas.tsx`.
- **Requirements:** 
  - Needs to feel like a premium, luxury fashion district/bazaar.
  - Must include shops (e.g., Tee Studio, Mug Bar).
  - Must use the official color palette (Champagne Gold, Ivory Stone, Graphite, Warm Amber lights).
  - Avoid cheap neon, cyberpunk, or flat empty spaces.

## 4. Key File Architecture
- `app/page.tsx`: The main entry point. It conditionally shows the `LandingExperience` or the `WorldCanvasWrapper` based on the `hasEntered` state.
- `components/ui/LandingExperience.tsx`: The locked-in coded cinematic entrance.
- `components/world/WorldCanvasWrapper.tsx`: Manages the 3D Canvas setup and handles the `SafeEnvironment` fallback (to prevent HDR fetch crashes).
- `components/world/SafeEnvironment.tsx`: A robust ErrorBoundary wrapper for Drei's `<Environment>` to prevent WebGL crashes if the CDN fails.
- `components/world/Plaza.tsx`: The main 3D scene holding the shops (Needs work).
- `lib/store/useStore.ts` & `useCartStore.ts`: Zustand stores managing UI and cart state.

## 5. Instructions for ChatGPT
When you (ChatGPT) start working on this project:
1. **Do not break the Landing Page:** Assume `components/ui/LandingExperience.tsx` is perfect. Focus only on the Plaza or routing.
2. **Strict Tailwind Palette:** Always use the defined brand colors: `#D4AF37` (Champagne Gold), `#F4EFE7` (Ivory Stone), `#1C1E22` (Graphite), `#E6C96A` (Soft Gold). Do not use default yellow (`#FFD700`).
3. **Ask before writing massive files:** Ask the user to paste the contents of `components/world/Plaza.tsx` or `WorldCanvas.tsx` if you need to see how it's currently built before modifying it.
4. **Agentic Behavior:** Act as an expert senior developer. Write robust, error-free React components and always consider Next.js SSR boundaries (`"use client"` vs Server Components).

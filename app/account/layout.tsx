"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService, UserSession } from "@/lib/services/authService";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: 'OVERVIEW', path: '/account' },
  { label: 'ORDERS', path: '/account/orders' },
  { label: 'MY DESIGNS', path: '/account/designs' },
  { label: 'MW VAULT', path: '/account/wishlist' }, // reusing wishlist here or separate? We have /wishlist. We'll link to it.
  { label: 'ADDRESSES', path: '/account/addresses' },
  { label: 'PROFILE', path: '/account/profile' }
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Basic mock auth guard
    const s = authService.getSession();
    if (!s) {
      router.replace('/login');
    } else {
      setSession(s);
    }
    setLoading(false);
  }, [router]);

  if (loading) return null; // Avoid flash

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#050505] font-sans selection:bg-[#D4AF37] selection:text-[#050505] pointer-events-auto flex flex-col">
      {/* Account Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#e5e0d8] bg-white shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-bold tracking-[0.2em]">MW TRENDS</Link>
          <span className="text-[10px] tracking-[0.3em] font-bold text-[#888] hidden md:block pl-4 border-l border-[#e5e0d8]">MY MW</span>
        </div>
        <div className="flex items-center gap-6 text-xs font-semibold tracking-widest text-[#666]">
          <Link href="/track-order" className="hover:text-[#D4AF37]">TRACK ORDER</Link>
          <button onClick={() => { authService.logout(); router.push('/login'); }} className="hover:text-red-500">
            LOGOUT
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto">
        {/* Sidebar Nav (Desktop) & Top Tabs (Mobile) */}
        <nav className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-[#e5e0d8] bg-white md:bg-transparent overflow-x-auto md:overflow-x-visible hide-scrollbar sticky top-16 md:static z-40">
          <ul className="flex md:flex-col p-4 md:p-8 gap-2 min-w-max md:min-w-0">
            {NAV_ITEMS.map(item => {
              // We'll treat exactly match except for /account
              const isActive = item.path === '/account' ? pathname === '/account' : pathname.startsWith(item.path);
              
              if (item.path === '/account/wishlist') {
                 // Route out to the main wishlist
                 return (
                  <li key={item.path}>
                    <Link href="/wishlist" className="block px-4 py-3 text-xs tracking-widest font-bold text-[#888] hover:text-[#050505] hover:bg-white/50 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                 );
              }

              return (
                <li key={item.path} className="relative">
                  <Link 
                    href={item.path}
                    className={`block px-4 py-3 text-xs tracking-widest font-bold transition-colors z-10 relative
                      ${isActive ? 'text-[#050505]' : 'text-[#888] hover:text-[#050505] hover:bg-white/50'}
                    `}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <motion.div 
                      layoutId="account-nav-active"
                      className="absolute inset-0 bg-white border border-[#e5e0d8] z-0 shadow-sm"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

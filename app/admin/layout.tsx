"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { adminService, AdminUser, AdminRole } from "@/lib/services/adminService";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const current = adminService.getCurrentAdmin();
    if (!current) {
      // Prototype fallback
      adminService.switchAdminRole('SUPER_ADMIN');
      setAdmin(adminService.getCurrentAdmin());
    } else {
      setAdmin(current);
    }
    setLoading(false);
  }, []);

  if (loading || !admin) return null;

  const NavItem = ({ href, label, icon, requiredPermission }: any) => {
    if (requiredPermission && !admin.permissions.includes(requiredPermission)) return null;
    
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    
    return (
      <Link 
        href={href} 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`block px-4 py-3 text-xs tracking-widest font-bold transition-colors ${
          isActive ? 'bg-[#222] text-[#F7F4ED] border-l-2 border-[#D4AF37]' : 'text-[#888] hover:text-[#F7F4ED] hover:bg-[#1a1a1a] border-l-2 border-transparent'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#050505] font-sans pointer-events-auto flex">
      
      {/* Mobile Header (Visible only on sm) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#111] text-[#F7F4ED] flex items-center justify-between px-4 z-50">
        <span className="text-sm font-bold tracking-[0.2em]">MW CONTROL</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-xs font-bold tracking-widest">
          {isMobileMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* Sidebar (Desktop sticky, Mobile overlay) */}
      <AnimatePresence>
        {(isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#111] text-[#F7F4ED] shrink-0 z-40 flex flex-col pt-16 md:pt-0 shadow-xl md:shadow-none overflow-y-auto hide-scrollbar`}
          >
            <div className="p-6 border-b border-[#222] hidden md:block">
              <h1 className="text-sm font-bold tracking-[0.2em] text-white">MW CONTROL</h1>
              <p className="text-[10px] tracking-widest text-[#888] mt-1">OPERATIONS CENTER</p>
            </div>

            <div className="p-4 border-b border-[#222]">
              <p className="text-[10px] tracking-[0.2em] text-[#888] mb-2 font-bold px-4">OVERVIEW</p>
              <NavItem href="/admin" label="DASHBOARD" />
            </div>

            <div className="p-4 border-b border-[#222]">
              <p className="text-[10px] tracking-[0.2em] text-[#888] mb-2 font-bold px-4">ORDERS</p>
              <NavItem href="/admin/orders" label="ALL ORDERS" requiredPermission="order.read" />
              <NavItem href="/admin/custom-orders" label="PRODUCTION QUEUE" requiredPermission="design.review" />
            </div>

            <div className="p-4 border-b border-[#222]">
              <p className="text-[10px] tracking-[0.2em] text-[#888] mb-2 font-bold px-4">COMMERCE</p>
              <NavItem href="/admin/products" label="PRODUCTS & INVENTORY" requiredPermission="product.read" />
            </div>

            <div className="p-4 border-b border-[#222]">
              <p className="text-[10px] tracking-[0.2em] text-[#888] mb-2 font-bold px-4">MARKETING</p>
              <NavItem href="/admin/campaigns" label="CAMPAIGNS" requiredPermission="campaign.read" />
              <NavItem href="/admin/world-ads" label="MW WORLD ADS" requiredPermission="campaign.manage" />
            </div>

            <div className="p-4 border-b border-[#222]">
              <p className="text-[10px] tracking-[0.2em] text-[#888] mb-2 font-bold px-4">SYSTEM</p>
              <NavItem href="/admin/health" label="TECHNICAL HEALTH" requiredPermission="system.manage" />
              <NavItem href="/admin/audit-log" label="AUDIT LOG" requiredPermission="audit.read" />
            </div>

            {/* Prototype Role Switcher */}
            <div className="mt-auto p-4 border-t border-[#222] bg-[#0a0a0b]">
              <p className="text-[10px] tracking-[0.2em] text-[#888] mb-2 font-bold">PROTOTYPE ROLE</p>
              <select 
                value={admin.role}
                onChange={(e) => {
                  adminService.switchAdminRole(e.target.value as AdminRole);
                  window.location.reload();
                }}
                className="w-full bg-[#111] text-xs p-2 border border-[#333] text-[#F7F4ED] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="SUPER_ADMIN">Owner (Super Admin)</option>
                <option value="STORE_MANAGER">Store Manager</option>
                <option value="PRODUCTION_MANAGER">Production Manager</option>
                <option value="MARKETING_MANAGER">Marketing Manager</option>
                <option value="SUPPORT_AGENT">Support Agent</option>
              </select>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        <header className="h-16 bg-white border-b border-[#e5e0d8] flex items-center justify-between px-8 sticky top-0 md:top-0 z-30 shrink-0 hidden md:flex">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#888]">
            {pathname.split('/').map((p, i) => p ? <span key={i}>/ {p.toUpperCase()}</span> : null)}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest text-[#050505] bg-[#e5e0d8] px-3 py-1">
              {admin.role.replace('_', ' ')}
            </span>
            <Link href="/" className="text-[10px] font-bold tracking-widest text-[#666] hover:text-[#050505]">
              EXIT TO STORE
            </Link>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>

    </div>
  );
}

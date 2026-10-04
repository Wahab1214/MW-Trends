"use client";

import { useState, useEffect } from "react";
import { authService } from "@/lib/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@mwtrends.com"); // Pre-fill for easy demo
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authService.getSession()) router.replace('/account');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authService.login(email);
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#050505] font-sans pointer-events-auto flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#e5e0d8] p-8 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold tracking-[0.2em] block mb-2">MW TRENDS</Link>
          <h1 className="text-[10px] tracking-widest text-[#888]">SIGN IN TO YOUR ACCOUNT</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-widest font-bold text-[#666]">EMAIL OR PHONE</label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-white border border-[#d5d0c8] focus:outline-none focus:border-[#050505] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-widest font-bold text-[#666]">PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white border border-[#d5d0c8] focus:outline-none focus:border-[#050505] transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#050505] text-[#F7F4ED] font-bold tracking-[0.2em] text-sm hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
           <span className="text-[10px] tracking-widest text-[#666]">No account? </span>
           <button className="text-[10px] tracking-widest text-[#050505] font-bold underline underline-offset-4 cursor-not-allowed opacity-50">CREATE ACCOUNT</button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { adminService, AuditLog } from "@/lib/services/adminService";

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Slight delay to simulate fetch
    setTimeout(() => {
      setLogs(adminService.getAuditLogs());
      setLoading(false);
    }, 200);
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-6 max-w-[1400px]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">AUDIT LOG</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">Immutable record of system operations.</p>
        </div>
      </div>

      <div className="bg-white border border-[#e5e0d8] overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F7F4ED] text-[#888] text-[10px] tracking-widest font-bold border-b border-[#e5e0d8]">
            <tr>
              <th className="p-4">TIMESTAMP</th>
              <th className="p-4">ACTOR</th>
              <th className="p-4">ACTION</th>
              <th className="p-4">ENTITY</th>
              <th className="p-4 w-full">DETAILS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e0d8]">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-[#faf9f6] transition-colors group">
                <td className="p-4 text-[#666] text-[10px] font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-4">
                  <p className="font-bold text-[#050505] text-xs">{log.actorName}</p>
                </td>
                <td className="p-4">
                   <span className="px-2 py-1 text-[9px] font-bold tracking-widest border border-[#d5d0c8] bg-[#F7F4ED] text-[#050505]">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-[#666] text-xs font-mono">{log.entityType} ({log.entityId.slice(0, 8)})</td>
                <td className="p-4 text-xs text-[#050505] truncate max-w-md">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {logs.length === 0 && (
          <div className="p-12 text-center text-[#888] text-xs tracking-widest">
            NO AUDIT LOGS FOUND.
          </div>
        )}
      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/services/orderService";
import Link from "next/link";

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    orderService.getAllOrders().then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                          o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return null;

  return (
    <div className="space-y-6 max-w-[1400px]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">ORDERS</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">Manage standard and custom fulfillment.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search Order # or Name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 text-xs border border-[#d5d0c8] focus:outline-none focus:border-[#050505] min-w-[200px]"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 text-xs border border-[#d5d0c8] focus:outline-none focus:border-[#050505] bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="RECEIVED">Received</option>
            <option value="PROCESSING">Processing / Printing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#e5e0d8] overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F7F4ED] text-[#888] text-[10px] tracking-widest font-bold border-b border-[#e5e0d8]">
            <tr>
              <th className="p-4 w-12"></th>
              <th className="p-4">ORDER #</th>
              <th className="p-4">DATE</th>
              <th className="p-4">CUSTOMER</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">ITEMS</th>
              <th className="p-4 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e0d8]">
            {filteredOrders.map(order => {
              const hasCustom = order.items.some(i => i.isCustom);
              return (
                <tr key={order.id} className="hover:bg-[#faf9f6] transition-colors group">
                  <td className="p-4">
                    {hasCustom && <div className="w-2 h-2 rounded-full bg-[#D4AF37] ml-2" title="Contains Custom Design" />}
                  </td>
                  <td className="p-4 font-bold text-[#050505]">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-[#D4AF37] hover:underline underline-offset-4">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4 text-[#666] text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">{order.shippingAddress.fullName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[9px] font-bold tracking-widest border
                      ${order.orderStatus === 'DELIVERED' ? 'bg-[#e5e0d8] text-[#050505] border-[#d5d0c8]' 
                        : order.orderStatus === 'SHIPPED' ? 'bg-[#050505] text-white border-[#050505]'
                        : order.orderStatus === 'PROCESSING' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                        : 'bg-white text-[#D4AF37] border-[#D4AF37]'}
                    `}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-[#666] text-xs">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</td>
                  <td className="p-4 text-right font-bold">Rs. {order.total.toLocaleString('en-IN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-[#888] text-xs tracking-widest">
            NO ORDERS FOUND.
          </div>
        )}
      </div>

    </div>
  );
}

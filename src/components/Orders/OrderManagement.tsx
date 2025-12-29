"use client";

import { useState } from "react";
import { Search, Eye } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
}

export default function OrderManagement() {
  const [search, setSearch] = useState("");

  const orders: Order[] = [
    {
      id: "ORD001",
      customer: "Nguyen Van A",
      total: 59.99,
      status: "Pending",
      createdAt: "2024-06-10",
    },
    {
      id: "ORD002",
      customer: "Tran Thi B",
      total: 120.5,
      status: "Completed",
      createdAt: "2024-06-11",
    },
  ];

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl bg-white p-6 text-gray-800 shadow-theme-xl dark:bg-slate-900 dark:text-white">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage customer orders
          </p>
        </div>

        {/* SEARCH ONLY */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-10 rounded-lg pl-9 pr-4 text-sm
              border border-gray-300 bg-white
              dark:border-gray-700 dark:bg-gray-800
            "
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <th className="py-3 text-left">Order ID</th>
              <th className="text-left">Customer</th>
              <th className="text-left">Total</th>
              <th className="text-left">Status</th>
              <th className="text-left">Created</th>
              <th className="text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
              >
                <td className="py-4">{o.id}</td>
                <td>{o.customer}</td>
                <td className="font-semibold">${o.total}</td>
                <td>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
                    {o.status}
                  </span>
                </td>
                <td className="text-xs text-gray-500 dark:text-gray-400">
                  {o.createdAt}
                </td>
                <td className="text-right pr-6">
                  <button className="rounded-md p-1 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-gray-700">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

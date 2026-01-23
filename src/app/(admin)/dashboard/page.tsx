"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { getAdminDashboardOverview } from "../../../../services/dashboard.service";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getAdminDashboardOverview().then(setData);
  }, []);

  if (!data) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  /* ===== SAFE FALLBACK ===== */
  const totalUsers = data.users?.totalUsers ?? 0;
  const newUsers = data.users?.newUsersThisMonth ?? 0;

  const totalOrders = data.orders?.totalOrders ?? 0;

  const totalProducts = data.products?.totalProducts ?? 0;
  const outOfStock = data.products?.outOfStock ?? 0;

  const revenue = data.revenue ?? {};
  const monthlyRevenue = revenue.monthlyRevenue ?? Array(12).fill(0);

  const percent = revenue.totalRevenue
    ? Math.round((revenue.thisMonthRevenue / revenue.totalRevenue) * 100)
    : 0;

  /* ===== CHART OPTIONS ===== */
  const chartOptions: ApexOptions = {
    chart: { type: "bar", height: 200 },
    xaxis: {
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ],
    },
  };

  return (
    <div className="space-y-6 p-6">
      {/* ===== METRICS ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border p-4 bg-white">
          <p className="text-gray-500">Customers</p>
          <h3 className="text-2xl font-bold">{totalUsers}</h3>
          <span className="text-green-600">+{newUsers} this month</span>
        </div>

        <div className="rounded-xl border p-4 bg-white">
          <p className="text-gray-500">Orders</p>
          <h3 className="text-2xl font-bold">{totalOrders}</h3>
        </div>

        <div className="rounded-xl border p-4 bg-white">
          <p className="text-gray-500">Products</p>
          <h3 className="text-2xl font-bold">{totalProducts}</h3>
          <span className="text-red-500">{outOfStock} out of stock</span>
        </div>

        <div className="rounded-xl border p-4 bg-white">
          <p className="text-gray-500">Revenue</p>
          <h3 className="text-2xl font-bold">
            ${revenue.totalRevenue ?? 0}
          </h3>
        </div>
      </div>

      {/* ===== MONTHLY REVENUE CHART ===== */}
      <div className="rounded-xl border bg-white p-4">
        <h3 className="mb-3 font-semibold">Monthly Revenue</h3>

        {monthlyRevenue.every((v: number) => v === 0) ? (
          <div className="py-10 text-center text-gray-400">
            No revenue data yet
          </div>
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={[
              {
                name: "Revenue",
                data: monthlyRevenue,
              },
            ]}
            type="bar"
            height={200}
          />
        )}
      </div>

      {/* ===== TARGET ===== */}
      <div className="rounded-xl border bg-white p-4">
        <h3 className="font-semibold mb-2">Monthly Target</h3>
        <p>Progress: {percent}%</p>
        <p>Total: ${revenue.totalRevenue ?? 0}</p>
        <p>This month: ${revenue.thisMonthRevenue ?? 0}</p>
        <p>Today: ${revenue.todayRevenue ?? 0}</p>
      </div>
    </div>
  );
}

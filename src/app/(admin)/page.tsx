"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { getAdminDashboardOverview } from "../../../services/dashboard.service";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* ================== FORMAT TIỀN ================== */
function formatVND(value: number) {
  return value.toLocaleString("vi-VN") + " ₫";
}

/* ================== TYPES ================== */
type UserFilter = "week" | "lastWeek" | "month" | "quarter";
type RevenueFilter = "week" | "lastWeek" | "month" | "quarter";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [userFilter, setUserFilter] = useState<UserFilter>("week");
  const [revenueFilter, setRevenueFilter] =
    useState<RevenueFilter>("month");

  useEffect(() => {
    getAdminDashboardOverview().then(setData);
  }, []);

  if (!data) {
    return <div className="p-6">Đang tải dashboard...</div>;
  }

  /* ================== DATA ================== */
  const users = data.users ?? {};
  const orders = data.orders ?? {};
  const products = data.products ?? {};
  const revenue = data.revenue ?? {};

  /* USERS */
  const totalUsers = users.totalUsers ?? 0;
  const newUsersThisMonth = users.newUsersThisMonth ?? 0;

  /* ORDERS */
  const {
    totalOrders = 0,
    pending = 0,
    confirmed = 0,
    shipped = 0,
    delivered = 0,
    cancelled = 0,
  } = orders;

  /* PRODUCTS */
  const totalProducts = products.totalProducts ?? 0;
  const outOfStock = products.outOfStock ?? 0;

  /* REVENUE */
  const {
    totalRevenue = 0,
    todayRevenue = 0,
    thisMonthRevenue = 0,
    revenueByWeek = {},
    revenueByMonth = [],
    revenueByQuarter = [],
  } = revenue;

  /* ================== USER CHART ================== */
  function getUserChartData() {
    switch (userFilter) {
      case "week":
        return {
          categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          data: [1, 2, 0, 1, 3, 2, 1],
        };
      case "lastWeek":
        return {
          categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          data: [0, 1, 1, 0, 2, 1, 0],
        };
      case "quarter":
        return {
          categories: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
          data: [totalUsers, 0, 0, 0],
        };
      default:
        return {
          categories: [
            "Th1","Th2","Th3","Th4","Th5","Th6",
            "Th7","Th8","Th9","Th10","Th11","Th12",
          ],
          data: [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
    }
  }

  /* ================== REVENUE CHART ================== */
  function getRevenueChartData() {
    switch (revenueFilter) {
      case "week":
        return {
          categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          data: revenueByWeek?.thisWeek ?? [],
        };
      case "lastWeek":
        return {
          categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          data: revenueByWeek?.lastWeek ?? [],
        };
      case "quarter":
        return {
          categories: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
          data: revenueByQuarter ?? [],
        };
      default:
        return {
          categories: [
            "Th1","Th2","Th3","Th4","Th5","Th6",
            "Th7","Th8","Th9","Th10","Th11","Th12",
          ],
          data: revenueByMonth ?? [],
        };
    }
  }

  /* ================== OPTIONS ================== */
  const userChartOptions: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 5 },
    xaxis: { categories: getUserChartData().categories },
    dataLabels: { enabled: false },
  };

  const revenueChartOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 6, columnWidth: "45%" },
    },
    xaxis: {
      categories: getRevenueChartData().categories,
    },
    tooltip: {
      y: { formatter: (v: number) => formatVND(v) },
    },
    dataLabels: { enabled: false },
  };

  const orderStatusOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: [
      "Chờ xử lý",
      "Đã xác nhận",
      "Đang giao",
      "Đã giao",
      "Đã huỷ",
    ],
    legend: { position: "bottom" },
  };

  return (
    <div className="space-y-8 p-6">
      {/* ================== KPI ================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <KPI title="Khách hàng" value={totalUsers} note={`+${newUsersThisMonth} trong tháng`} />
        <KPI title="Đơn hàng" value={totalOrders} />
        <KPI title="Sản phẩm" value={totalProducts} note={`${outOfStock} hết hàng`} danger />
        <KPI title="Doanh thu" value={formatVND(totalRevenue)} />
      </div>

      {/* ================== USERS ================== */}
      <Section
        title="👤 Người dùng đăng ký"
        filter={userFilter}
        setFilter={setUserFilter}
      >
        <ReactApexChart
          options={userChartOptions}
          series={[
            { name: "Người dùng mới", data: getUserChartData().data },
          ]}
          type="line"
          height={280}
        />
      </Section>

      {/* ================== REVENUE ================== */}
      <Section
        title="📊 Doanh thu"
        filter={revenueFilter}
        setFilter={setRevenueFilter}
      >
        <ReactApexChart
          options={revenueChartOptions}
          series={[
            { name: "Doanh thu", data: getRevenueChartData().data },
          ]}
          type="bar"
          height={260}
        />
      </Section>

      {/* ================== ORDER STATUS ================== */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="mb-3 font-semibold">📦 Trạng thái đơn hàng</h3>
        <ReactApexChart
          options={orderStatusOptions}
          series={[pending, confirmed, shipped, delivered, cancelled]}
          type="donut"
          height={300}
        />
      </div>
    </div>
  );
}

/* ================== COMPONENTS ================== */

function Section({ title, filter, setFilter, children }: any) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex gap-2">
          {[
            { key: "week", label: "Tuần này" },
            { key: "lastWeek", label: "Tuần trước" },
            { key: "month", label: "Tháng" },
            { key: "quarter", label: "Quý" },
          ].map((b: any) => (
            <button
              key={b.key}
              onClick={() => setFilter(b.key)}
              className={`px-3 py-1 text-sm rounded border
                ${filter === b.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
                }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

function KPI({ title, value, note, danger }: any) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      {note && (
        <span className={danger ? "text-red-500" : "text-green-600"}>
          {note}
        </span>
      )}
    </div>
  );
}

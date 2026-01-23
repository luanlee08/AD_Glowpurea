"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Revenue {
  totalRevenue: number;
  thisMonthRevenue: number;
  todayRevenue: number;
}

export default function MonthlyTarget({ revenue }: { revenue?: Revenue }) {
  if (!revenue) return null; // 🛡️ CHỐNG CRASH

  const percent = revenue.totalRevenue
    ? Math.round((revenue.thisMonthRevenue / revenue.totalRevenue) * 100)
    : 0;

  const options: ApexOptions = {
    chart: { type: "radialBar" },
  };

  return (
    <>
      <ReactApexChart
        options={options}
        series={[percent]}
        type="radialBar"
        height={300}
      />
      <p>Total: ${revenue.totalRevenue}</p>
      <p>This month: ${revenue.thisMonthRevenue}</p>
      <p>Today: ${revenue.todayRevenue}</p>
    </>
  );
}

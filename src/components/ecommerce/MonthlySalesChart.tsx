"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlySalesChart({ revenue }: { revenue: number[] }) {
  const options: ApexOptions = {
    chart: { type: "bar", height: 180 },
    xaxis: { categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ name: "Revenue", data: revenue }]}
      type="bar"
      height={180}
    />
  );
}

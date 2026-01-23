"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart({ revenue }: { revenue: number[] }) {
  const options: ApexOptions = { chart: { type: "area" } };

  return (
    <ReactApexChart
      options={options}
      series={[{ name: "Revenue", data: revenue }]}
      type="area"
      height={300}
    />
  );
}

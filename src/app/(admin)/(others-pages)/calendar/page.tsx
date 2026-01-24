"use client";

import dynamic from "next/dynamic";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

const ProductManagement = dynamic(
  () => import("@/components/Products/ProductManagement"),
  { ssr: false }
);

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Management" />
      <ProductManagement />
    </div>
  );
}

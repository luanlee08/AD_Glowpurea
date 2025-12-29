import OrderManagement from "@/components/Orders/OrderManagement";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Order Management | TailAdmin",
  description: "Manage customer orders and order status",
};

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Order Management" />
      <OrderManagement />
    </div>
  );
}

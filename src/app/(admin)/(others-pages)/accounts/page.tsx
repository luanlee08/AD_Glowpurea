import AccountManagement from "@/components/Accounts/AccountsManagement";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Account Management | TailAdmin",
  description: "Manage user accounts, roles and status",
};

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Account Management" />
      <AccountManagement />
    </div>
  );
}

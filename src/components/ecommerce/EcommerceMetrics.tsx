"use client";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, GroupIcon, BoxIconLine } from "@/icons";

interface Props {
  users: {
    totalUsers: number;
    newUsersThisMonth: number;
  };
  orders: {
    totalOrders: number;
  };
}

export const EcommerceMetrics = ({ users, orders }: Props) => {
  if (!users || !orders) return null; // 🛡️ chống crash

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border p-5 bg-white">
        <GroupIcon />
        <p>Customers</p>
        <h3>{users.totalUsers}</h3>
        <Badge color="success">
          <ArrowUpIcon /> +{users.newUsersThisMonth}
        </Badge>
      </div>

      <div className="rounded-2xl border p-5 bg-white">
        <BoxIconLine />
        <p>Orders</p>
        <h3>{orders.totalOrders}</h3>
      </div>
    </div>
  );
};


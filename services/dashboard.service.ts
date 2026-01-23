// services/dashboard.service.ts
import axiosAdmin from "@/lib/axiosAdmin";
import { API_ENDPOINTS } from "../configs/api-configs";

function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export async function getAdminDashboardOverview() {
  const token = getAdminToken();

  const res = await axiosAdmin.get(API_ENDPOINTS.ADMIN_DASHBOARD_OVERVIEW, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

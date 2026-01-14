import axiosAdmin from "@/lib/axiosAdmin";
import { API_ENDPOINTS } from "./../configs/api-configs";

export type AccountStatus = "Active" | "Inactive" | "Blocked";

export interface Account {
  accountId: number;
  accountName: string;
  email: string;
  phoneNumber?: string;
  status: AccountStatus;
  roleName?: string;
  createdAt: string;
}

export interface SearchAccountParams {
  keyword?: string;
  status?: AccountStatus;
  page?: number;
  pageSize?: number;
}

export const getAccounts = async (params: SearchAccountParams) => {
  const res = await axiosAdmin.get(API_ENDPOINTS.ACCOUNTS, { params });
  return res.data;
};

export const updateAccountStatus = async (
  accountId: number,
  status: AccountStatus
) => {
  const res = await axiosAdmin.patch(
    API_ENDPOINTS.ACCOUNT_UPDATE_STATUS(accountId),
    { status }
  );
  return res.data;
};

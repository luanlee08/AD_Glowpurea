import axios from "axios";
import { API_ENDPOINTS } from "../configs/api-configs";

export interface AdminLoginRequest {
  identifier: string;
  password: string;
}

export interface AdminLoginResponse {
  accountId: number;
  accountName: string;
  email: string;
  role: string;
  token: string;
}

export const adminLogin = async (
  payload: AdminLoginRequest
): Promise<AdminLoginResponse> => {
  const res = await axios.post<AdminLoginResponse>(
    API_ENDPOINTS.ADMIN_LOGIN,
    payload
  );

  return res.data;
};

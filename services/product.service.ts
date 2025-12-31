import axios from "axios";
import { API_ENDPOINTS } from "../configs/api-configs";

/* ================= TYPES ================= */

export interface ProductApi {
  productId: number;
  sku: string;
  productName: string;
  categoryName: string | null;
  shapesName: string | null;
  mainImageUrl: string | null;
  price: number;
  quantity: number;
  productStatus: string;
  createdAt: string;
}

/* ================= CREATE PRODUCT ================= */

export const createProduct = async (form: FormData) => {
  const res = await axios.post(
    API_ENDPOINTS.PRODUCT_CREATE,
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

/* ================= GET PRODUCTS ================= */

export interface PagedResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}

export interface GetProductParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export const getProducts = async (
  params: GetProductParams
): Promise<PagedResponse<ProductApi>> => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      query.append(k, String(v));
    }
  });

  const res = await fetch(
    `${API_ENDPOINTS.PRODUCTS}?${query.toString()}`
  );

  if (!res.ok) {
    throw new Error("Không thể lấy danh sách sản phẩm");
  }

  return res.json();
};

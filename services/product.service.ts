import axiosAdmin from "@/lib/axiosAdmin";
import { API_BASE, API_ENDPOINTS } from "../configs/api-configs";

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

/* ================= CREATE ================= */

export const createProduct = async (form: FormData) => {
  const res = await axiosAdmin.post(API_ENDPOINTS.PRODUCT_CREATE, form);
  return res.data;
};


/* ================= GET LIST ================= */

export const getProducts = async (
  params: GetProductParams
): Promise<PagedResponse<ProductApi>> => {

  const res = await axiosAdmin.get(API_ENDPOINTS.PRODUCTS, {
    params,
  });

  const json = res.data;

  return {
    ...json,
    data: json.data.map((p: ProductApi) => ({
      ...p,
      mainImageUrl: p.mainImageUrl
        ? `${API_BASE}${p.mainImageUrl}`
        : null,
    })),
  };
};


/* ================= GET DETAIL ================= */

export const getProductById = async (productId: number) => {
  const res = await axiosAdmin.get(
    `${API_ENDPOINTS.PRODUCTS}/${productId}`
  );

  const json = res.data;

  return {
    ...json,
    mainImageUrl: json.mainImageUrl
      ? `${API_BASE}${json.mainImageUrl}`
      : null,
    subImageUrls: json.subImageUrls?.map(
      (url: string) => `${API_BASE}${url}`
    ),
  };
};


/* ================= UPDATE ================= */

export const updateProduct = async (
  productId: number,
  form: FormData
) => {
  const res = await axiosAdmin.put(
    `${API_ENDPOINTS.PRODUCTS}/${productId}`,
    form
  );

  return res.data;
};


import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const getProducts = async (): Promise<ProductApi[]> => {
  const res = await axios.get(`${API_URL}/api/products`);
  return res.data;
};

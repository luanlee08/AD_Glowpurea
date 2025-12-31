import axios from "axios";
import { API_ENDPOINTS } from "../configs/api-configs";

export interface LookupItem {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<LookupItem[]> => {
  const res = await axios.get(API_ENDPOINTS.CATEGORIES);

  return res.data.map((c: any) => ({
    id: c.categoryId,
    name: c.categoryName,
  }));
};

export const getShapes = async (): Promise<LookupItem[]> => {
  const res = await axios.get(API_ENDPOINTS.SHAPES);

  return res.data.map((s: any) => ({
    id: s.shapesId,
    name: s.shapesName,
  }));
};

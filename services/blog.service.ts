import axios from "axios";
import { API_BASE, API_ENDPOINTS } from "../configs/api-configs";

export interface BlogAdminApi {
  blogPostId: number;
  blogTitle: string;
  blogContent: string;
  blogThumbnail: string | null;
  blogCategory: string;
  authorEmail: string;
  isPublished: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  createdAt: string;
}


export interface BlogPagedResponse {
  total: number;
  page: number;
  pageSize: number;
  data: BlogAdminApi[];
}

export const searchAdminBlogs = async (params: {
  keyword?: string;
  page: number;
  pageSize: number;
}): Promise<BlogPagedResponse> => {
  const res = await axios.get(
    `${API_BASE}/api/admin/blogs/search`,
    { params }
  );

  const raw = res.data;

  return {
    total: raw.total ?? raw.Total,
    page: raw.page ?? raw.Page,
    pageSize: raw.pageSize ?? raw.PageSize,
    data: (raw.data ?? raw.Data).map((b: BlogAdminApi) => ({
      ...b,
      blogThumbnail: b.blogThumbnail
        ? `${API_BASE}${b.blogThumbnail}`
        : null,
    })),
  };
};


export const createBlog = async (formData: FormData) => {
  const res = await axios.post(
    API_ENDPOINTS.ADMIN_BLOG_CREATE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const updateBlog = async (
  blogId: number,
  formData: FormData
) => {
  const res = await axios.put(
    `${API_BASE}/api/admin/blogs/${blogId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

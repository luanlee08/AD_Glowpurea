export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:63731";

export const API_ENDPOINTS = {
  // ===== PRODUCTS =====
  PRODUCTS: `${API_BASE}/api/admin/products`,          // GET (view/search/paging)
  PRODUCT_CREATE: `${API_BASE}/api/admin/products`,    // POST (add product)
  PRODUCT_UPDATE: (id: number) =>
    `${API_BASE}/api/admin/products/${id}`,

  // ===== CATEGORIES =====
  CATEGORIES: `${API_BASE}/api/categories`,      // GET

  // ===== BLOG (ADMIN) =====
  ADMIN_BLOGS: `${API_BASE}/api/admin/blogs/search`,
  ADMIN_BLOG_CREATE: `${API_BASE}/api/admin/blogs`,
  ADMIN_BLOG_UPDATE: (id: number) =>
    `${API_BASE}/api/admin/blogs/${id}`,

  // ===== SHAPES =====
  SHAPES: `${API_BASE}/api/shapes`,

    /* ===== BLOG CATEGORY ===== */
  BLOG_CATEGORIES: `${API_BASE}/api/blog-categories`, 
  // ===== AUTH (ADMIN) =====
  ADMIN_LOGIN: `${API_BASE}/api/admin/auth/login`,
};

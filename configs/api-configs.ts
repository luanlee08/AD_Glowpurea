export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:63731";

export const API_ENDPOINTS = {
  // ===== PRODUCTS =====
  PRODUCTS: `${API_BASE}/api/products`,          // GET (view/search/paging)
  PRODUCT_CREATE: `${API_BASE}/api/products`,    // POST (add product)
  PRODUCT_UPDATE: (id: number) =>
    `${API_BASE}/api/products/${id}`,

  // ===== CATEGORIES =====
  CATEGORIES: `${API_BASE}/api/categories`,      // GET

  // ===== SHAPES =====
  SHAPES: `${API_BASE}/api/shapes`,      

  // AUTH: {
  //   LOGIN: `${API_BASE}/api/auth/login`,
  //   REGISTER: `${API_BASE}/api/auth/register`,
  //   VERIFY_OTP: `${API_BASE}/api/auth/verify-otp`,
  // },
};

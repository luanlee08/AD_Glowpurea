import { API_ENDPOINTS } from "../configs/api-configs";

const getAuthHeader = () => {
  const token = localStorage.getItem("admin_token");
  return {
    Authorization: `Bearer ${token}`,
  };
};


/* ================= ADMIN ================= */

export const getAdminOrders = async () => {
  const res = await fetch(API_ENDPOINTS.ADMIN_ORDERS, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Get admin orders failed");
  return res.json();
}

export const updateOrderStatus = async (
  orderId: number,
  statusId: number
) => {
  const res = await fetch(
    API_ENDPOINTS.ADMIN_UPDATE_ORDER_STATUS(orderId),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ statusId }),
    }
  );

  if (!res.ok) throw new Error("Update order status failed");
  return res.json();
};

export const getAdminOrderDetail = async (orderId: number) => {
  const res = await fetch(
    API_ENDPOINTS.ADMIN_ORDER_DETAIL(orderId),
    {
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) throw new Error("Get order detail failed");
  return res.json();
};

export interface DashboardOverview {
  orders: {
    totalOrders: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  revenue: {
    totalRevenue: number;
    thisMonthRevenue: number;
    todayRevenue: number;
    monthlyRevenue: number[];
  };
  users: {
    totalUsers: number;
    newUsersThisMonth: number;
  };
  products: {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
  };
}

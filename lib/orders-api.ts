import apiClient from "./api"
import type { PaginatedResponse, Order } from "./types"

export const ordersAPI = {
  getOrders: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Order>> => {
    const params: any = { page, limit }
    if (status) params.status = status
    const response = await apiClient.get("/orders", { params })
    return response.data
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data.data
  },

  updateOrderStatus: async (id: string, data: { status?: string; paymentStatus?: string }) => {
    const response = await apiClient.put(`/orders/${id}`, data)
    return response.data
  },

  deleteOrder: async (id: string) => {
    const response = await apiClient.delete(`/orders/${id}`)
    return response.data
  },
}

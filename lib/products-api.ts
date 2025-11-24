import apiClient from "./api"
import type { PaginatedResponse, Product } from "./types"

export const productsAPI = {
  getProducts: async (page = 1, limit = 10): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get("/items", { params: { page, limit } })
    return response.data
  },

  createProduct: async (data: FormData) => {
    const response = await apiClient.post("/items", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  updateProduct: async (id: string, data: FormData) => {
    const response = await apiClient.put(`/items/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/items/${id}`)
    return response.data
  },
}

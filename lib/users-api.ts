import apiClient from "./api"
import type { PaginatedResponse, Customer } from "./types"

export const usersAPI = {
  getUsers: async (page = 1, limit = 10): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get("/users", { params: { page, limit } })
    return response.data
  },

  getUserById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data.data
  },
}

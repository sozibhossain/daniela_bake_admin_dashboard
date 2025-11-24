"use client"

import { useQuery } from "@tanstack/react-query"
import { ordersAPI } from "@/lib/orders-api"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Coffee, TrendingUp, Wallet } from "lucide-react"

export function DashboardOverview() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", 1],
    queryFn: () => ordersAPI.getOrders(1, 100),
  })

  const orders = ordersData?.data.orders || []
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0)
  const deliveredCount = orders.filter((o: any) => o.status === "Delivered").length

  const stats = [
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: orders.length,
    },
    {
      icon: Coffee,
      label: "Total Delivered",
      value: deliveredCount,
    },
    {
      icon: Wallet,
      label: "Total Revenue",
      value: `$${totalRevenue}`,
    },
    {
      icon: TrendingUp,
      label: "Total Orders",
      value: orders.length,
    },
  ]

  const chartData = [
    { name: "Sun", value: 400 },
    { name: "Mon", value: 300 },
    { name: "Tue", value: 200 },
    { name: "Wed", value: 278 },
    { name: "Thu", value: 189 },
    { name: "Fri", value: 239 },
    { name: "Sat", value: 349 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className="w-10 h-10 text-blue-100" />
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Chart Order</h3>
          {isLoading ? (
            <Skeleton className="h-80" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Total Revenue</h3>
          {isLoading ? (
            <Skeleton className="h-80" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Revenue" />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order: any) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order._id.slice(-6)}</td>
                    <td className="px-4 py-3">{order.user.name}</td>
                    <td className="px-4 py-3">${order.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

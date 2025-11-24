"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "@/lib/users-api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => usersAPI.getUsers(page, 10),
  });

  const users = data?.data?.users || [];
  const totalUsers = data?.data?.total || users.length;
  const totalPages = data?.data?.pages || 1;

  const filteredUsers = users.filter((user: any) =>
    searchQuery
      ? user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const getTotalSpent = (user: any) =>
    (user.orders || []).reduce(
      (sum: number, o: any) => sum + (o.totalAmount || 0),
      0
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Customer Lists</h1>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#7B3F00] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-left font-bold">Phone</th>
                  <th className="px-4 py-3 text-left font-bold">
                    Total Order
                  </th>
                  <th className="px-4 py-3 text-left font-bold">
                    Order Amount
                  </th>
                  <th className="px-4 py-3 text-left font-bold">Joined</th>
                  <th className="px-4 py-3 text-left font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />

                        {/* Avatar / Initial */}
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shrink-0">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            user.name?.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{user.phone || "N/A"}</td>
                    <td className="px-4 py-3">
                      {user.orders?.length || 0} times
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      $
                      {getTotalSpent(user).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedCustomer(user)}
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * 10 + 1} to{" "}
            {Math.min(page * 10, totalUsers)} from {totalUsers}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-[#DCEBFB] text-[#5B9FED] border-none hover:bg-[#C8E1FA]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {[1, 2, 3].map((p) => (
              <Button
                key={p}
                size="sm"
                variant={page === p ? "default" : "outline"}
                className={
                  page === p
                    ? "bg-[#5B9FED] hover:bg-[#4A8FDD] text-white"
                    : "border-gray-200 text-gray-600"
                }
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="bg-[#DCEBFB] text-[#5B9FED] border-none hover:bg-[#C8E1FA]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog
        open={!!selectedCustomer}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomer(null);
        }}
      >
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-semibold">
                    Customer Details
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-sm"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                </div>
              </DialogHeader>

              {/* Top profile card like the design */}
              <div className="bg-gray-50 rounded-xl p-5 flex items-center gap-4 mb-6 border border-gray-200">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-600 shrink-0">
                  {selectedCustomer.avatar ? (
                    <Image
                      src={selectedCustomer.avatar}
                      alt={selectedCustomer.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    selectedCustomer.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">
                    {selectedCustomer.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Joined{" "}
                    {format(
                      new Date(selectedCustomer.createdAt),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-3">
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="font-semibold text-sm">
                    {selectedCustomer.orders?.length || 0}
                  </p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="font-semibold text-sm">
                    ${getTotalSpent(selectedCustomer).toFixed(2)}
                  </p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold text-sm">
                    {selectedCustomer.phone || "N/A"}
                  </p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-gray-500">Last Active</p>
                  <p className="font-semibold text-sm">
                    {selectedCustomer.lastLogin
                      ? format(
                          new Date(selectedCustomer.lastLogin),
                          "MMM dd, yyyy"
                        )
                      : "--"}
                  </p>
                </Card>
              </div>

              {/* Order history table */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Order History
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#7B3F00] text-white">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs">
                          Order Number
                        </th>
                        <th className="px-3 py-2 text-left text-xs">
                          Item name
                        </th>
                        <th className="px-3 py-2 text-left text-xs">
                          Total Numbers
                        </th>
                        <th className="px-3 py-2 text-left text-xs">
                          Order Amount
                        </th>
                        <th className="px-3 py-2 text-left text-xs">
                          Payment Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs">
                          Purchase Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.orders?.map(
                        (order: any, index: number) => (
                          <tr
                            key={order._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-3 py-2">{index + 1}</td>
                            <td className="px-3 py-2">
                              {order.items?.[0]?.item?.name || "N/A"}
                            </td>
                            <td className="px-3 py-2">
                              {order.items?.reduce(
                                (sum: number, i: any) => sum + i.quantity,
                                0
                              )}{" "}
                              times
                            </td>
                            <td className="px-3 py-2 font-semibold">
                              ${order.totalAmount}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  order.paymentStatus === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              {format(
                                new Date(order.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </td>
                          </tr>
                        )
                      )}
                      {(!selectedCustomer.orders ||
                        selectedCustomer.orders.length === 0) && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-3 py-4 text-center text-gray-500"
                          >
                            No orders found for this customer.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

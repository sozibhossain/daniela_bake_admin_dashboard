"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { productsAPI } from "@/lib/products-api"
import type { Product } from "@/lib/types"

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSuccess?: () => void
}

export function DeleteProductDialog({ open, onOpenChange, product, onSuccess }: DeleteProductDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!product) return

    setLoading(true)
    try {
      await productsAPI.deleteProduct(product._id)
      toast.success("Product deleted successfully")
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{product?.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

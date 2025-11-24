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
import { categoriesAPI } from "@/lib/categories-api"
import type { Category } from "@/lib/types"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSuccess?: () => void
}

export function DeleteCategoryDialog({ open, onOpenChange, category, onSuccess }: DeleteCategoryDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!category) return

    setLoading(true)
    try {
      await categoriesAPI.deleteCategory(category._id)
      toast.success("Category deleted successfully")
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{category?.name}"? This action cannot be undone.
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

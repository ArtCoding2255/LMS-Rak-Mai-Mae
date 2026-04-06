"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteProductButton({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("ไม่สามารถลบสินค���าได้");
        return;
      }

      toast.success("ลบสินค้าเรียบร้อยแล้ว");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center h-9 rounded-md px-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-accent transition-colors">
        <Trash2 className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ยื��ยันการลบสินค้า</DialogTitle>
          <DialogDescription>
            คุณต้องการลบสินค้า &quot;{productTitle}&quot; ใช่หรือไม่?
            การลบจะไม่สามารถกู้คืนได้
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            ยกเลิก
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "ก��ลังลบ..." : "ลบสินค้า"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

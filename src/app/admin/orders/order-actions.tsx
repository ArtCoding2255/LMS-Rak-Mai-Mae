"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function OrderActions({ orderId, showApproval = true }: { orderId: string; showApproval?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/${action}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      if (action === "approve") {
        toast.success("อนุมัติการชำระเงินแล้ว");
      } else {
        toast.error("ปฏิเสธการชำระเงินแล้ว");
      }
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("ต้องการลบคำสั่งซื้อนี้หรือไม่? การลบจะไม่สามารถกู้คืนได้")) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "เกิดข้อผิดพลาด");
        return;
      }
      toast.success("ลบคำสั่งซื้อแล้ว");
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      {showApproval && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => handleAction("approve")}
            disabled={loading !== null}
          >
            {loading === "approve" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleAction("reject")}
            disabled={loading !== null}
          >
            {loading === "reject" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleDelete}
        disabled={loading !== null}
      >
        {loading === "delete" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/providers/cart-provider";

export function AddToCartButton({ courseId }: { courseId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { refresh: refreshCart } = useCart();

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "เกิดข้อผิดพลาด");
      } else {
        await refreshCart();
        router.refresh();
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleAddToCart}
      disabled={loading}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {loading ? "กำลังเพิ่ม..." : "เพิ่มลงตะกร้า"}
    </Button>
  );
}

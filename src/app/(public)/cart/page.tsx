"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, BookOpen, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/providers/cart-provider";

interface CartItem {
  id: string;
  course: {
    id: string;
    title: string;
    slug: string;
    price: number;
    imageUrl: string | null;
  } | null;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    imageUrl: string | null;
  } | null;
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const { refresh: refreshCart } = useCart();

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data.cart);
    } catch {
      toast.error("ไม่สามารถโหลดตะกร้าได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (item: CartItem) => {
    const itemId = item.course?.id || item.product?.id;
    setRemoving(itemId || null);
    try {
      const body = item.course
        ? { courseId: item.course.id }
        : { productId: item.product!.id };

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        fetchCart();
        refreshCart();
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setRemoving(null);
    }
  };

  const getItemTitle = (item: CartItem) => item.course?.title || item.product?.title || "";
  const getItemPrice = (item: CartItem) => item.course?.price || item.product?.price || 0;
  const getItemSlug = (item: CartItem) =>
    item.course ? `/courses/${item.course.slug}` : `/products/${item.product!.slug}`;
  const getItemId = (item: CartItem) => item.course?.id || item.product?.id || "";

  const total = cart?.items.reduce((sum, item) => sum + getItemPrice(item), 0) ?? 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <ShoppingCart className="h-6 w-6" />
        ตะกร้าสินค้า
      </h1>

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            ตะกร้าว่างเปล่า
          </h2>
          <p className="text-gray-400 mb-6">ยังไม่มีสินค้าในตะกร้า</p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/courses">ดูคอร์สทั้งหมด</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">ดูโครเชต์แพทเทิร์น</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-lg flex items-center justify-center shrink-0 ${
                    item.course
                      ? "bg-gradient-to-br from-nude-light to-brand/10"
                      : "bg-gradient-to-br from-purple-50 to-brand/10"
                  }`}>
                    {item.course ? (
                      <BookOpen className="h-8 w-8 text-brand-light" />
                    ) : (
                      <FileText className="h-8 w-8 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={getItemSlug(item)}
                      className="font-semibold hover:text-brand-dark transition-colors line-clamp-1"
                    >
                      {getItemTitle(item)}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.course ? "คอร์สเรียน" : "โครเชต์แพทเทิร์น (PDF)"}
                    </p>
                    <p className="text-lg font-bold text-brand-dark mt-1">
                      {getItemPrice(item).toLocaleString()} บาท
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item)}
                    disabled={removing === getItemId(item)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">สรุปคำสั่งซื้อ</h2>
              <div className="space-y-2 text-sm">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600 truncate mr-2">
                      {getItemTitle(item)}
                    </span>
                    <span>{getItemPrice(item).toLocaleString()} บาท</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>รวมทั้งหมด</span>
                <span className="text-brand-dark">
                  {total.toLocaleString()} บาท
                </span>
              </div>
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => router.push("/checkout")}
              >
                ดำเนินการชำระเงิน
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

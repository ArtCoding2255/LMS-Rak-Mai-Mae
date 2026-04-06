"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    imageUrl: string | null;
    pdfUrl: string;
    published: boolean;
  };
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [loading, setLoading] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          price: parseFloat(price),
          imageUrl: imageUrl || null,
          pdfUrl,
          published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      toast.success(isEditing ? "อัปเดตสินค้าเรียบร้อย" : "สร้างสินค้าเรียบร้อย");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อสินค้า</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="เช่น แพทเทิร์นกระเป๋าโครเชต์"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="crochet-bag-pattern"
              required
            />
            <p className="text-xs text-gray-500">
              ใช้สำหรับ URL เช่น /products/{slug || "xxx"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดสินค้า</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="อธิบายรายละเอียดสินค้า..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">ราคา (บาท)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="199"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL รูปภาพปก</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... หรือ /uploads/cover.jpg"
            />
            <p className="text-xs text-gray-500">
              ไม่บังคับ — ใช้แสดงเป็นรูปปกสินค้าในหน้าเว็บ
            </p>
            {imageUrl && (
              <div className="mt-2 border rounded-lg overflow-hidden w-48 h-28">
                <img src={imageUrl} alt="ตัวอย่างรูปปก" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdfUrl">ลิงก์ไฟล์ PDF</Label>
            <Input
              id="pdfUrl"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://... หรือ /uploads/pattern.pdf"
              required
            />
            <p className="text-xs text-gray-500">
              URL ของไฟล์ PDF ที่ลูกค้าจะได้รับหลังซื้อ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="published">เผยแพร่สินค้านี้</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "กำลังบันทึก..."
                : isEditing
                ? "อัปเดตสินค้า"
                : "สร้างสินค้า"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              ยกเลิก
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

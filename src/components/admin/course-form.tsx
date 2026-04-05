"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface CourseFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    published: boolean;
  };
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [loading, setLoading] = useState(false);

  // สร้าง slug อัตโนมัติจากชื่อ
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9ก-๙\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
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
        ? `/api/admin/courses/${initialData.id}`
        : "/api/admin/courses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          price: parseFloat(price),
          published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      toast.success(isEditing ? "อัปเดตคอร์สเรียบร้อย" : "สร้างคอร์สเรียบร้อย");
      router.push("/admin/courses");
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
        <CardTitle>{isEditing ? "แก้ไขคอร์ส" : "สร้างคอร์สใหม่"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อคอร์ส</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="เช่น โครเชต์เบื้องต้น"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="crochet-basics"
              required
            />
            <p className="text-xs text-gray-500">
              ใช้สำหรับ URL เช่น /courses/{slug || "xxx"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดคอร์ส</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="อธิบายรายละเอียดคอร์ส..."
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
              placeholder="590"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="published">เผยแพร่คอร์สนี้</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "กำลังบันทึก..."
                : isEditing
                ? "อัปเดตคอร์ส"
                : "สร้างคอร์ส"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/courses")}
            >
              ยกเลิก
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

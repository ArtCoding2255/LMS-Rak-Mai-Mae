"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleFormProps {
  articleId?: string;
}

export function ArticleForm({ articleId }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const isEdit = !!articleId;

  useEffect(() => {
    fetch("/api/admin/article-categories")
      .then((r) => r.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (articleId) {
      fetch(`/api/admin/articles/${articleId}`)
        .then((r) => r.json())
        .then((data) => {
          setTitle(data.title);
          setSlug(data.slug);
          setExcerpt(data.excerpt || "");
          setContent(data.content);
          setCoverImage(data.coverImage || "");
          setPublished(data.published);
          setCategoryId(data.categoryId);
        });
    }
  }, [articleId]);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9ก-๙-]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content || !categoryId) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setLoading(true);
    const url = isEdit
      ? `/api/admin/articles/${articleId}`
      : "/api/admin/articles";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          coverImage,
          published,
          categoryId,
        }),
      });

      if (res.ok) {
        toast.success(isEdit ? "แก้ไขบทความสำเร็จ" : "สร้างบทความสำเร็จ");
        router.push("/admin/articles");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">ชื่อบทความ *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isEdit) setSlug(generateSlug(e.target.value));
            }}
            placeholder="ชื่อบทความ"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated"
          />
        </div>
      </div>

      {/* Category & Published */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>หมวดหมู่ *</Label>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500 mt-1">
              ยังไม่มีหมวดหมู่{" "}
              <a href="/admin/article-categories" className="text-brand-dark underline">
                สร้างหมวดหมู่ก่อน
              </a>
            </p>
          ) : (
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">เผยแพร่บทความ</span>
          </label>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <Label htmlFor="coverImage">ลิงก์รูปปกบทความ</Label>
        <Input
          id="coverImage"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {coverImage && (
          <div className="relative w-48 h-32 rounded-lg overflow-hidden border mt-2">
            <img
              src={coverImage}
              alt="cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <Label htmlFor="excerpt">เนื้อหาย่อ</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="เนื้อหาสรุปสั้นๆ สำหรับแสดงในหน้ารายการบทความ"
          rows={3}
        />
      </div>

      {/* Content - Rich Text Editor */}
      <div>
        <Label>เนื้อหาบทความ *</Label>
        <div className="mt-1">
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEdit ? "บันทึกการแก้ไข" : "สร้างบทความ"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/articles")}
        >
          ยกเลิก
        </Button>
      </div>
    </form>
  );
}

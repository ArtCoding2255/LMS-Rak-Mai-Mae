"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { articles: number };
}

export default function ArticleCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/article-categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9ก-๙-]/g, "");

  const handleAdd = async () => {
    if (!name.trim()) return;
    const res = await fetch("/api/admin/article-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slug || generateSlug(name) }),
    });
    if (res.ok) {
      toast.success("เพิ่มหมวดหมู่สำเร็จ");
      setName("");
      setSlug("");
      fetchCategories();
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/admin/article-categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, slug: editSlug }),
    });
    if (res.ok) {
      toast.success("แก้ไขสำเร็จ");
      setEditingId(null);
      fetchCategories();
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบหมวดหมู่นี้?")) return;
    const res = await fetch(`/api/admin/article-categories/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("ลบสำเร็จ");
      fetchCategories();
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">จัดการหมวดหมู่บทความ</h1>

      {/* Add form */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="name">ชื่อหมวดหมู่</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                placeholder="เช่น เทคนิคการถัก"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-1" />
                เพิ่ม
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีหมวดหมู่</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="py-3 px-4 flex items-center justify-between">
                {editingId === cat.id ? (
                  <div className="flex flex-1 gap-2 items-center">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="max-w-xs"
                    />
                    <Input
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleUpdate(cat.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-gray-400 text-sm ml-2">/{cat.slug}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        ({cat._count.articles} บทความ)
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                          setEditSlug(cat.slug);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { GripVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  position: number;
}

function SortableLesson({
  lesson,
  onEdit,
  onDelete,
}: {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 rounded-lg border bg-white"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand-dark flex items-center justify-center text-sm font-semibold shrink-0">
        {lesson.position}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{lesson.title}</p>
        <p className="text-xs text-gray-500 truncate">{lesson.youtubeUrl}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => onEdit(lesson)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600"
          onClick={() => onDelete(lesson.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function LessonsManager({
  courseId,
  initialLessons,
}: {
  courseId: string;
  initialLessons: Lesson[];
}) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const openAddDialog = () => {
    setEditingLesson(null);
    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setDialogOpen(true);
  };

  const openEditDialog = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setDescription(lesson.description || "");
    setYoutubeUrl(lesson.youtubeUrl);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title || !youtubeUrl) {
      toast.error("กรุณากรอกชื่อบทเรียนและ YouTube URL");
      return;
    }

    setLoading(true);
    try {
      if (editingLesson) {
        const res = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, youtubeUrl }),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setLessons((prev) =>
          prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
        );
        toast.success("อัปเดตบทเรียนเรียบร้อย");
      } else {
        const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, youtubeUrl }),
        });
        if (!res.ok) throw new Error();
        const newLesson = await res.json();
        setLessons((prev) => [...prev, newLesson]);
        toast.success("เพิ่มบทเรียนเรียบร้อย");
      }
      setDialogOpen(false);
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("ต้องการลบบทเรียนนี้ใช่หรือไม่?")) return;

    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("ลบบทเรียนเรียบร้อย");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessons.findIndex((l) => l.id === active.id);
    const newIndex = lessons.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(lessons, oldIndex, newIndex).map((l, i) => ({
      ...l,
      position: i + 1,
    }));

    setLessons(reordered);

    try {
      await fetch(`/api/admin/courses/${courseId}/lessons/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessons: reordered.map((l) => ({ id: l.id, position: l.position })),
        }),
      });
    } catch {
      toast.error("ไม่สามารถบันทึกลำดับได้");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มบทเรียน
        </Button>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            ยังไม่มีบทเรียน กดปุ่ม &quot;เพิ่มบทเรียน&quot; เพื่อเริ่มต้น
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={lessons.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <SortableLesson
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={openEditDialog}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "แก้ไขบทเรียน" : "เพิ่มบทเรียนใหม่"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อบทเรียน</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น วิธีจับเข็มโครเชต์"
              />
            </div>
            <div className="space-y-2">
              <Label>รายละเอียด (ไม่บังคับ)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายเนื้อหาสั้นๆ"
              />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
import { GripVertical, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string | null;
  position: number;
  parentId?: string | null;
  children?: Lesson[];
}

function SortableLesson({
  lesson,
  onEdit,
  onDelete,
  onAddChild,
  isChild = false,
}: {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  isChild?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasChildren = lesson.children && lesson.children.length > 0;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border bg-white ${isChild ? "ml-10 border-dashed" : ""}`}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {!isChild && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {hasChildren ? (
              expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <div className="w-4" />
            )}
          </button>
        )}

        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand-dark flex items-center justify-center text-sm font-semibold shrink-0">
          {lesson.position}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{lesson.title}</p>
          {lesson.youtubeUrl && (
            <p className="text-xs text-gray-500 truncate">{lesson.youtubeUrl}</p>
          )}
          {!isChild && !lesson.youtubeUrl && (
            <p className="text-xs text-gray-400">บทหลัก (ไม่มีวิดีโอ)</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!isChild && (
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600"
              onClick={() => onAddChild?.(lesson.id)}
              title="เพิ่มบทเรียนย่อย"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
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

      {/* บทเรียนย่อย */}
      {!isChild && expanded && hasChildren && (
        <div className="space-y-2 mt-2">
          {lesson.children!.map((child) => (
            <SortableLesson
              key={child.id}
              lesson={child}
              onEdit={onEdit}
              onDelete={onDelete}
              isChild
            />
          ))}
        </div>
      )}
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
  const [addingParentId, setAddingParentId] = useState<string | null>(null);
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
    setAddingParentId(null);
    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setDialogOpen(true);
  };

  const openAddChildDialog = (parentId: string) => {
    setEditingLesson(null);
    setAddingParentId(parentId);
    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setDialogOpen(true);
  };

  const openEditDialog = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setAddingParentId(null);
    setTitle(lesson.title);
    setDescription(lesson.description || "");
    setYoutubeUrl(lesson.youtubeUrl || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title) {
      toast.error("กรุณากรอกชื่อบทเรียน");
      return;
    }

    setLoading(true);
    try {
      if (editingLesson) {
        const res = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, youtubeUrl: youtubeUrl || null }),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();

        if (editingLesson.parentId) {
          // แก้ไขบทเรียนย่อย
          setLessons((prev) =>
            prev.map((l) => ({
              ...l,
              children: l.children?.map((c) =>
                c.id === updated.id ? { ...c, ...updated } : c
              ),
            }))
          );
        } else {
          // แก้ไขบทหลัก
          setLessons((prev) =>
            prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
          );
        }
        toast.success("อัปเดตบทเรียนเรียบร้อย");
      } else {
        const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            youtubeUrl: youtubeUrl || null,
            parentId: addingParentId,
          }),
        });
        if (!res.ok) throw new Error();
        const newLesson = await res.json();

        if (addingParentId) {
          // เพิ่มบทเรียนย่อย
          setLessons((prev) =>
            prev.map((l) =>
              l.id === addingParentId
                ? { ...l, children: [...(l.children || []), newLesson] }
                : l
            )
          );
          toast.success("เพิ่มบทเรียนย่อยเรียบร้อย");
        } else {
          setLessons((prev) => [...prev, { ...newLesson, children: [] }]);
          toast.success("เพิ่มบทเรียนเรียบร้อย");
        }
      }
      setDialogOpen(false);
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("ต้องการลบบทเรียนนี้ใช่หรือไม่? (บทเรียนย่อยทั้งหมดจะถูกลบด้วย)")) return;

    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();

      // ลบบทหลัก
      setLessons((prev) => {
        const filtered = prev.filter((l) => l.id !== lessonId);
        // ลบบทย่อย
        return filtered.map((l) => ({
          ...l,
          children: l.children?.filter((c) => c.id !== lessonId),
        }));
      });

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
    if (oldIndex === -1 || newIndex === -1) return;

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

  const parentName = addingParentId
    ? lessons.find((l) => l.id === addingParentId)?.title
    : null;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มบทเรียนหลัก
        </Button>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            ยังไม่มีบทเรียน กดปุ่ม &quot;เพิ่มบทเรียนหลัก&quot; เพื่อเริ่มต้น
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
                  onAddChild={openAddChildDialog}
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
              {editingLesson
                ? "แก้ไขบทเรียน"
                : addingParentId
                  ? `เพิ่มบทเรียนย่อยใน "${parentName}"`
                  : "เพิ่มบทเรียนหลัก"}
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
              <Label>YouTube URL {!addingParentId && !editingLesson?.parentId && "(ไม่บังคับสำหรับบทหลัก)"}</Label>
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

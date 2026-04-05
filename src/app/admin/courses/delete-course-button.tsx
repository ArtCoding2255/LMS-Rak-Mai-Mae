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

export function DeleteCourseButton({
  courseId,
  courseTitle,
}: {
  courseId: string;
  courseTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("ไม่สามารถลบคอร์สได้");
        return;
      }

      toast.success("ลบคอร์สเรียบร้อยแล้ว");
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
          <DialogTitle>ยืนยันการลบคอร์ส</DialogTitle>
          <DialogDescription>
            คุณต้องการลบคอร์ส &quot;{courseTitle}&quot; ใช่หรือไม่?
            การลบจะไม่สามารถกู้คืนได้ รวมถึงบทเรียนทั้งหมดในคอร์สนี้
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
            {loading ? "กำลังลบ..." : "ลบคอร์ส"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

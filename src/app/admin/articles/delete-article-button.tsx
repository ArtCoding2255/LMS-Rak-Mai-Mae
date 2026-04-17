"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteArticleButton({
  articleId,
  articleTitle,
}: {
  articleId: string;
  articleTitle: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`ต้องการลบบทความ "${articleTitle}"?`)) return;

    const res = await fetch(`/api/admin/articles/${articleId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("ลบบทความสำเร็จ");
      router.refresh();
    } else {
      toast.error("ลบไม่สำเร็จ");
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-red-500 hover:text-red-700"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

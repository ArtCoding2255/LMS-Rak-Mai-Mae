"use client";

import { useParams } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">แก้ไขบทความ</h1>
      <ArticleForm articleId={articleId} />
    </div>
  );
}

import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">เขียนบทความใหม่</h1>
      <ArticleForm />
    </div>
  );
}

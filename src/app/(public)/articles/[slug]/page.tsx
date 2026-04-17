import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const article = await db.article.findUnique({
    where: { slug, ...(!isAdmin && { published: true }) },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true } },
    },
  });

  if (!article) notFound();

  // Related articles in same category
  const relatedArticles = await db.article.findMany({
    where: {
      published: true,
      categoryId: article.categoryId,
      NOT: { id: article.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { title: true, slug: true, coverImage: true, createdAt: true },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-dark mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับหน้าบทความ
      </Link>

      <article className="max-w-3xl mx-auto">
        {/* Draft banner */}
        {!article.published && (
          <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            บทความนี้ยังไม่ได้เผยแพร่ (แบบร่าง) — เฉพาะแอดมินเท่านั้นที่เห็น
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Link href={`/articles?category=${article.category.slug}`}>
              <Badge variant="secondary">{article.category.name}</Badge>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>โดย {article.author.name}</span>
            <span>·</span>
            <span>
              {new Date(article.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="article-content max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="max-w-3xl mx-auto border-t pt-10 mt-10">
          <h2 className="text-xl font-bold mb-6">บทความที่เกี่ยวข้อง</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/articles/${related.slug}`}
                className="group"
              >
                <div className="h-32 rounded-lg overflow-hidden bg-gray-100 mb-2">
                  {related.coverImage ? (
                    <img
                      src={related.coverImage}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-nude-light to-brand/10" />
                  )}
                </div>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-brand-dark transition-colors">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

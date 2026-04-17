import { db } from "@/lib/db";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const categories = await db.articleCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: { where: { published: true } } } } },
  });

  const articles = await db.article.findMany({
    where: {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">บทความ</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          เคล็ดลับ เทคนิค และแรงบันดาลใจเกี่ยวกับงานถักโครเชต์
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <Link href="/articles">
          <Badge
            variant={!category ? "default" : "secondary"}
            className="px-4 py-1.5 text-sm cursor-pointer"
          >
            ทั้งหมด
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/articles?category=${cat.slug}`}>
            <Badge
              variant={category === cat.slug ? "default" : "secondary"}
              className="px-4 py-1.5 text-sm cursor-pointer"
            >
              {cat.name} ({cat._count.articles})
            </Badge>
          </Link>
        ))}
      </div>

      {/* Article Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">ยังไม่มีบทความในหมวดนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="h-48 bg-gradient-to-br from-nude-light to-brand/10 overflow-hidden">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-12 w-12 text-brand-light" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.category.name}
                    </Badge>
                  </div>
                  <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{article.author.name}</span>
                    <span>
                      {new Date(article.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

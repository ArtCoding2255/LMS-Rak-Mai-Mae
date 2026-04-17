import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye } from "lucide-react";
import { DeleteArticleButton } from "./delete-article-button";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการบทความ</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/article-categories">หมวดหมู่</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/articles/new">
              <Plus className="h-4 w-4 mr-1" />
              เขียนบทความใหม่
            </Link>
          </Button>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>ยังไม่มีบทความ</p>
          <Link
            href="/admin/articles/new"
            className="text-brand-dark hover:underline mt-2 inline-block"
          >
            เขียนบทความแรก →
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อบทความ</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>ผู้เขียน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {article.coverImage && (
                        <img
                          src={article.coverImage}
                          alt=""
                          className="w-12 h-8 object-cover rounded"
                        />
                      )}
                      <span className="font-medium line-clamp-1">
                        {article.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{article.category.name}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {article.author.name}
                  </TableCell>
                  <TableCell>
                    {article.published ? (
                      <Badge className="bg-green-100 text-green-700">
                        เผยแพร่
                      </Badge>
                    ) : (
                      <Badge variant="secondary">แบบร่าง</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString("th-TH")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/articles/${article.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/articles/${article.id}`}>
                          แก้ไข
                        </Link>
                      </Button>
                      <DeleteArticleButton
                        articleId={article.id}
                        articleTitle={article.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

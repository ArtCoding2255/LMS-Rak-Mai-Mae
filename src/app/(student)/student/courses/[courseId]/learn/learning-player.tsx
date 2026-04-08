"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  position: number;
}

interface Course {
  id: string;
  title: string;
}

interface Props {
  course: Course;
  lessons: Lesson[];
  currentLesson: Lesson;
  progressMap: Record<string, boolean>;
}

function getYoutubeEmbedUrl(url: string): string {
  // รองรับหลายรูปแบบ YouTube URL
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export function LearningPlayer({
  course,
  lessons,
  currentLesson,
  progressMap: initialProgress,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [progress, setProgress] = useState(initialProgress);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const completedCount = lessons.filter((l) => progress[l.id]).length;
  const totalPercent =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  const handleMarkComplete = async () => {
    setMarkingComplete(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: !progress[currentLesson.id],
        }),
      });

      if (res.ok) {
        const newCompleted = !progress[currentLesson.id];
        setProgress((prev) => ({
          ...prev,
          [currentLesson.id]: newCompleted,
        }));
        toast.success(
          newCompleted ? "เรียนจบบทนี้แล้ว!" : "ยกเลิกเรียนจบบทนี้"
        );
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setMarkingComplete(false);
    }
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`${pathname}?lesson=${lessonId}`);
  };

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Sidebar - รายการบทเรียน */}
      <div
        className={cn(
          "border-r bg-white flex flex-col transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-80" : "w-0"
        )}
      >
        <div className="p-4 border-b shrink-0">
          <Link
            href="/student/courses"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Link>
          <h2 className="font-bold text-sm line-clamp-2">{course.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all"
                style={{ width: `${totalPercent}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{totalPercent}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {completedCount}/{lessons.length} บทเรียน
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lessons.map((lesson, index) => {
            const isActive = lesson.id === currentLesson.id;
            const isCompleted = progress[lesson.id];

            return (
              <button
                key={lesson.id}
                onClick={() => navigateToLesson(lesson.id)}
                className={cn(
                  "w-full text-left px-4 py-3 flex items-start gap-3 border-b hover:bg-gray-50 transition-colors",
                  isActive && "bg-nude-light border-l-4 border-l-brand"
                )}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium line-clamp-2",
                      isActive && "text-brand-dark"
                    )}
                  >
                    {index + 1}. {lesson.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Video Player */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-white shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold line-clamp-1">
              {currentIndex + 1}. {currentLesson.title}
            </p>
          </div>
        </div>

        {/* Video */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <div className="w-full h-full max-h-[70vh]">
            <iframe
              src={getYoutubeEmbedUrl(currentLesson.youtubeUrl)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="px-4 py-4 border-t bg-white shrink-0">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              disabled={!prevLesson}
              onClick={() => prevLesson && navigateToLesson(prevLesson.id)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              บทก่อนหน้า
            </Button>

            <Button
              variant={progress[currentLesson.id] ? "outline" : "default"}
              onClick={handleMarkComplete}
              disabled={markingComplete}
              className={
                progress[currentLesson.id]
                  ? "border-green-500 text-green-600"
                  : ""
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {progress[currentLesson.id]
                ? "เรียนจบแล้ว ✓"
                : "เรียนจบบทนี้"}
            </Button>

            <Button
              variant="outline"
              disabled={!nextLesson}
              onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
            >
              บทถัดไป
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* คำอธิบายบทเรียน */}
          {currentLesson.description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-1">
                รายละเอียดบทเรียน
              </h3>
              <p className="text-sm text-gray-600">
                {currentLesson.description}
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <a
              href="https://lin.ee/oxHGACz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              ปรึกษาคุณครู
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

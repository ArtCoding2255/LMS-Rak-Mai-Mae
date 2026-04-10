"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
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
  youtubeUrl: string | null;
  position: number;
  children?: Lesson[];
}

interface Course {
  id: string;
  title: string;
}

interface Props {
  course: Course;
  lessons: Lesson[];
  playableLessons: Lesson[];
  currentLesson: Lesson;
  progressMap: Record<string, boolean>;
}

function getYoutubeEmbedUrl(url: string): string {
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
  playableLessons,
  currentLesson,
  progressMap: initialProgress,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [progress, setProgress] = useState(initialProgress);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>(() => {
    // เปิด parent ที่มี currentLesson อยู่
    const initial: Record<string, boolean> = {};
    lessons.forEach((l) => {
      if (l.children?.some((c) => c.id === currentLesson.id)) {
        initial[l.id] = true;
      } else {
        initial[l.id] = true;
      }
    });
    return initial;
  });

  const currentIndex = playableLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? playableLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < playableLessons.length - 1 ? playableLessons[currentIndex + 1] : null;

  const completedCount = playableLessons.filter((l) => progress[l.id]).length;
  const totalPercent =
    playableLessons.length > 0
      ? Math.round((completedCount / playableLessons.length) * 100)
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

  const toggleParent = (parentId: string) => {
    setExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  const renderLessonItem = (lesson: Lesson, index: number, isChild = false) => {
    const isActive = lesson.id === currentLesson.id;
    const isCompleted = progress[lesson.id];
    const hasVideo = !!lesson.youtubeUrl;

    return (
      <button
        key={lesson.id}
        onClick={() => hasVideo && navigateToLesson(lesson.id)}
        className={cn(
          "w-full text-left px-4 py-3 flex items-start gap-3 border-b hover:bg-gray-50 transition-colors",
          isActive && "bg-nude-light border-l-4 border-l-brand",
          isChild && "pl-10",
          !hasVideo && "cursor-default"
        )}
        disabled={!hasVideo}
      >
        <div className="shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : hasVideo ? (
            <Circle className="h-5 w-5 text-gray-300" />
          ) : null}
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-medium line-clamp-2",
              isActive && "text-brand-dark",
              !hasVideo && "text-gray-500 font-semibold"
            )}
          >
            {index + 1}. {lesson.title}
          </p>
        </div>
      </button>
    );
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
            {completedCount}/{playableLessons.length} บทเรียน
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lessons.map((lesson, index) => {
            const hasChildren = lesson.children && lesson.children.length > 0;
            const isExpanded = expandedParents[lesson.id];

            if (hasChildren) {
              return (
                <div key={lesson.id}>
                  {/* บทหลัก (เป็นหัวข้อ) */}
                  <button
                    onClick={() => toggleParent(lesson.id)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 border-b bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform shrink-0",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                    <p className="text-sm font-semibold text-gray-700">
                      {index + 1}. {lesson.title}
                    </p>
                  </button>

                  {/* บทย่อย */}
                  {isExpanded &&
                    lesson.children!.map((child, childIndex) =>
                      renderLessonItem(child, childIndex, true)
                    )}
                </div>
              );
            }

            // บทเรียนที่ไม่มี children (บทเดี่ยว)
            return renderLessonItem(lesson, index);
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
            title={sidebarOpen ? "ซ่อนรายการบทเรียน" : "แสดงรายการบทเรียน"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold line-clamp-1">
              {currentLesson.title}
            </p>
          </div>
        </div>

        {/* Video */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <div className="w-full h-full">
            {currentLesson.youtubeUrl && (
              <iframe
                src={getYoutubeEmbedUrl(currentLesson.youtubeUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Toggle Content Button */}
        <button
          onClick={() => setContentOpen(!contentOpen)}
          className="flex items-center justify-center gap-1 py-1.5 border-t bg-gray-50 hover:bg-gray-100 transition-colors text-xs text-gray-500 shrink-0"
        >
          {contentOpen ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              ซ่อนเนื้อหา
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              แสดงเนื้อหา
            </>
          )}
        </button>

        {/* Bottom Controls */}
        <div className={cn("px-4 py-4 border-t bg-white shrink-0 transition-all duration-300 overflow-hidden", contentOpen ? "" : "h-0 p-0 border-0")}>
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

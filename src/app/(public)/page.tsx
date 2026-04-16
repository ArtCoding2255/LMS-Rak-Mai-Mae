import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Heart } from "lucide-react";
import { FaqSection } from "@/components/faq-section";

const features = [
  {
    icon: BookOpen,
    title: "คอร์สคุณภาพ",
    description: "คอร์สถักโครเชต์ที่ออกแบบมาอย่างเป็นขั้นตอน เข้าใจง่าย",
  },
  {
    icon: Users,
    title: "เรียนได้ทุกที่",
    description: "เรียนออนไลน์ได้ทุกที่ทุกเวลา ย้อนดูได้ไม่จำกัด",
  },
  {
    icon: Award,
    title: "ผู้สอนมืออาชีพ",
    description: "สอนโดยช่างฝีมือที่มีประสบการณ์การถักโครเชต์กว่า 40 ปี",
  },
  {
    icon: Heart,
    title: "ชุมชนคนรักงานถัก",
    description: "เข้าร่วมชุมชนคนรักงานฝีมือ แลกเปลี่ยนผลงานและเทคนิค",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-base via-nude-light to-base-warm py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            เรียนถักโครเชต์ออนไลน์
            <br />
            <span className="text-brand-dark">กับ รักไหมแม่ Academy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ตั้งแต่เบื้องต้นจนถึงขั้นสูง เรียนรู้ได้ตามจังหวะของคุณ
            พร้อมวิดีโอสอนที่เข้าใจง่ายและทำตามได้ทันที
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">ดูคอร์สทั้งหมด</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">สมัครสมาชิกฟรี</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ทำไมต้องเรียนกับเรา?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-brand/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-brand-dark" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA Section */}
      <section className="bg-brand text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นถักโครเชต์แล้วหรือยัง?
          </h2>
          <p className="text-white mb-8 max-w-xl mx-auto">
            สมัครสมาชิกวันนี้ แล้วเริ่มเรียนรู้ทักษะใหม่ที่จะเปลี่ยนเวลาว่างของคุณให้เป็นผลงานสุดภาคภูมิใจ
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">เริ่มเรียนเลย</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

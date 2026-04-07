import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          เกี่ยวกับ รักไหมแม่ Academy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          จากความรักในงานฝีมือ สู่ Academy ออนไลน์
          ที่จะพาคุณเข้าสู่โลกของการถักโครเชต์
        </p>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-4">เรื่องราวของเรา</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            รักไหมแม่ Academy เกิดจากความรักและหลงใหลในงานถักโครเชต์
            ที่ส่งต่อจากรุ่นสู่รุ่น จากคุณยายสู่แม่ และจากแม่สู่ลูก
            เราเชื่อว่าทุกคนสามารถเรียนรู้ศิลปะการถักโครเชต์ได้
            ไม่ว่าจะอายุเท่าไหร่หรือมีพื้นฐานมากน้อยแค่ไหน
          </p>
          <p>
            ด้วยประสบการณ์กว่า 20 ปีในการถักโครเชต์
            เราได้รวบรวมความรู้และเทคนิคต่างๆ
            มาจัดทำเป็นคอร์สออนไลน์ที่เข้าใจง่าย ทำตามได้ทันที
            เพื่อให้ทุกคนสามารถสร้างผลงานที่สวยงามด้วยมือของตัวเอง
          </p>
          <p>
            ไม่ว่าคุณจะอยากถักตุ๊กตา ถักกระเป๋า หรือถักผ้าพันคอ
            เรามีคอร์สที่ตอบโจทย์ทุกความต้องการ
            มาร่วมเป็นส่วนหนึ่งของครอบครัวรักไหมแม่กันนะคะ
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Heart className="h-8 w-8 text-romantic-dark mx-auto mb-3" />
            <div className="text-3xl font-bold text-brand-dark mb-1">20+</div>
            <p className="text-gray-600">ปีประสบการณ์</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-brand-dark mb-1">500+</div>
            <p className="text-gray-600">นักเรียนที่เรียนกับเรา</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

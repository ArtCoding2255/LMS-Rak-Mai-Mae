"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, X } from "lucide-react";

const galleryImages = [
  "https://res.cloudinary.com/dl5ze3lps/image/upload/v1776341472/654238077_122283830558192158_1202469106502079528_n_powaff.jpg",
  "https://res.cloudinary.com/dl5ze3lps/image/upload/v1776341472/654424796_122283830342192158_3629305421335710633_n_o5fn5j.jpg",
  "https://res.cloudinary.com/dl5ze3lps/image/upload/v1776341473/656999916_921884324086975_6710166474914313388_n_isgptu.jpg",
  "https://res.cloudinary.com/dl5ze3lps/image/upload/v1776341473/656139527_122284414322192158_4091436485488787545_n_vlhwac.jpg",
  "https://res.cloudinary.com/dl5ze3lps/image/upload/v1776341472/655246552_921884110753663_7951783117751544497_n_wh8bif.jpg",
  "https://res.cloudinary.com/dl5ze3lps/image/upload/v1776341472/654234194_921884520753622_7817824653425224357_n_qxqqpw.jpg",
  "https://res.cloudinary.com/dl5ze3lps/image/upload/v1776341473/654839194_122283830588192158_4007986709395528171_n_czuec3.jpg",
  "https://res.cloudinary.com/dl5ze3lps/image/upload/v1776341473/654483104_122283830396192158_7103745983372049971_n_jvh4e1.jpg",
];

export default function AboutPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            สวัสดีค่ะ พวกเรา รักไหมแม่ นะคะ รักไหมแม่ Academy เกิดขึ้นเพราะอยากส่งต่อความสุข
            ความภาคภูมิใจค่ะ การที่เราได้ทำงาน handmade ด้วยฝีมือของตัวเอง ได้ใช้งานจากผลงานนั้นจริงๆ
            เป็นความสุข เป็นคุณค่า และความอบอุ่นใจที่เราต้องการส่งต่อค่ะ
          </p>
          <p>
            รักไหมแม่ เริ่มต้นมาจาก คุณแม่กุ่ย ผู้ชื่นชอบและรักงานถักโครเชต์มาตลอดมากกว่า 40 ปี
            กลายเป็นภาพจำสายตาของลูกๆ จนสุดท้าย ลูกสาวโดนคุณแม่ป้ายยาแบบเนียนๆ
            จนกลายมาเป็นสาวเจน Z ผู้ชื่นชอบงานถัก และมองเห็นว่าในประเทศไทยเรา
            ยังขาดสื่อการสอนคุณภาพดีๆ และ community ให้กับคนกลุ่มใหม่ที่อยากเริ่มต้นถักโครเชต์
            เพราะโครเชต์ก็เป็นศาสตร์และศิลป์ที่ยอมรับเลยค่ะ ว่าก็มีความซับซ้อนสูง
            เทคนิคต่างๆ มากมาย เป็นศาสตร์ที่มีเสน่ห์มากกกก
            คุณลูกสาวเลยก่อตั้งโรงเรียนสอนออนไลน์มาเลยละกัน
            เนื่องจากมีลูกค้าที่ร้านถามหาคลิปสอนกันเยอะ มากๆ
            (พวกเรามีร้านขายไหมพรมและอุปกรณ์มาก่อนแล้วค่ะ ร้านรักไหมแม่)
          </p>
          <p>
            อย่างไรก็ฝากโรงเรียนสอนถักโครเชต์ออนไลน์ ครบวงจรแห่งแรกในไทย
            ไว้ในอ้อมอกอ้อมใจน้าค้าาา
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Crochet Workshop</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(src)}
              className="overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <img
                src={src}
                alt={`Crochet Workshop ${i + 1}`}
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Image Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage}
            alt="Crochet Workshop"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Heart className="h-8 w-8 text-romantic-dark mx-auto mb-3" />
            <div className="text-3xl font-bold text-brand-dark mb-1">40+</div>
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

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "ไม่เคยถักโครเชต์มาก่อนเลย เรียนได้ไหม?",
    answer: "ได้แน่นอนค่ะ! คอร์สของเราออกแบบมาสำหรับผู้เริ่มต้นโดยเฉพาะ สอนตั้งแต่พื้นฐานการจับเข็ม การถักโซ่ ไปจนถึงการถักกันจนได้ชิ้นงาน มีวิดีโอสาธิตทุกขั้นตอนอย่างละเอียดค่ะ",
  },
  {
    question: "ซื้อคอร์สแล้วดูได้นานแค่ไหน?",
    answer: "ดูได้ตลอดชีพเลยค่ะ เซื้อคอร์สแล้วสามารถเข้าดูซ้ำได้ไม่จำกัดจำนวนครั้ง ไม่มีหมดอายุ เรียนได้ตามสะดวกเลยค่ะ ที่สำคัญปรึกษาคุณครูได้ตลอดเวลาผ่าน Line OA ด้วยนะคะ",
  },
  {
    question: "ต้องเตรียมอุปกรณ์อะไรบ้าง?",
    answer: "เรามีอุปกรณ์ให้พร้อมเรียนส่งตรงถึงหน้าบ้านเลยค่ะ ในชุดเรียนจะมีไหมพรมคุณภาพดี เข็มโครเชต์ และอุปกรณ์เสริมต่างๆ ที่จำเป็นสำหรับการเรียนในแต่ละคอร์สค่ะ",
  },
  {
    question: "ชำระเงินได้ช่องทางไหนบ้าง?",
    answer: "ชำระผ่านการโอนเงินธนาคาร (KBank) ค่ะ หลังโอนแล้วอัปโหลดสลิปในระบบ แอดมินจะตรวจสอบและอนุมัติให้เข้าเรียนได้ภายใน 24 ชั่วโมงค่ะ",
  },
  {
    question: "ถ้าเรียนแล้วไม่เข้าใจ สามารถถามได้ไหม?",
    answer: "ได้เลยค่ะ! สามารถสอบถามปรึกษาคุณครูได้ผ่าน Line OA ของเราได้ตลอดเวลาค่ะ ทีมงานยินดีช่วยเหลือทุกปัญหาการถักค่ะ",
  },
  {
    question: "มีแพทเทิร์นให้ดาวน์โหลดไหม?",
    answer: "มีค่ะ! เรามีแพทเทิร์นโครเชต์ให้เลือกซื้อแยกได้ในหมวดโครเชต์แพทเทิร์น ซื้อแล้วสามารถดาวน์โหลดไฟล์ไปใช้งานได้เลยค่ะ",
  },
  {
    question: "ถักเป็นประมาณนึงแล้ว อยากได้แพทเทิร์นใหม่ๆ มีไหม?",
    answer: "เรามีเทคนิคใหม่ๆ สุดเจ๋งอัปเดตให้กับนักเรียนอยู่เสมอค่ะ มีทั้งเทคนิคการถักใหม่ๆ และแพทเทิร์นสวยๆ ให้เลือกซื้อเพิ่มเติมได้ทั้งในหมวดโครเชต์แพทเทิร์นและคอร์สเลยค่ะ",
  },
  {
    question: "ใครเป็นคนสอนคอร์สนี้?",
    answer: "หลักนักเรียนจะได้เรียนกับคุณครูแพรค่า ลูกสาวของคุณแม่กุ่ย ผู้มีประสบการณ์การถักโครเชต์มากกว่า5 ปี และยังมีคุณแม่กุ่ยที่เป็นช่างฝีมือถักโครเชต์มากกว่า 40 ปี มาร่วมสอนในบางคอร์สด้วยค่ะ",
  },
  {
    question: "เรียนแค่คอร์สเดียวจะถักโครเชต์เป็นเลยไหม?",
    answer: "คอร์สของเราออกแบบมาให้เรียนเป็นขั้นตอนค่ะ เริ่มจากพื้นฐานไปจนถึงเทคนิคต่างๆ ถ้าเรียนครบแล้วจะมีความรู้และทักษะในการถักโครเชต์ที่ครบถ้วน สามารถต่อยอดถักเป็นชิ้นงานอื่นๆ ได้แน่นอนค่ะ",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          คำถามที่พบบ่อย (FAQ)
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-200",
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

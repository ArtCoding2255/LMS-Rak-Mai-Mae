import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("🌱 เริ่มสร้างข้อมูลตัวอย่าง...");

  // ==========================================
  // สร้าง Admin
  // ==========================================
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      name: "Admin",
      email: "test@test.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ สร้าง Admin:", admin.email);

  // ==========================================
  // สร้างนักเรียนตัวอย่าง
  // ==========================================
  const studentPassword = await bcrypt.hash("student123", 10);

  const student1 = await prisma.user.upsert({
    where: { email: "somchai@example.com" },
    update: {},
    create: {
      name: "สมชาย ใจดี",
      email: "somchai@example.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "somying@example.com" },
    update: {},
    create: {
      name: "สมหญิง รักถัก",
      email: "somying@example.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: "manee@example.com" },
    update: {},
    create: {
      name: "มานี มีสุข",
      email: "manee@example.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });
  console.log("✅ สร้างนักเรียนตัวอย่าง 3 คน");

  // ==========================================
  // สร้างคอร์สตัวอย่าง
  // ==========================================
  const course1 = await prisma.course.upsert({
    where: { slug: "crochet-basics-for-beginners" },
    update: {},
    create: {
      title: "โครเชต์เบื้องต้นสำหรับผู้เริ่มต้น",
      slug: "crochet-basics-for-beginners",
      description:
        "เรียนรู้พื้นฐานการถักโครเชต์ตั้งแต่เริ่มต้น ตั้งแต่การจับเข็ม การร้อยไหม ไปจนถึงการถักลายพื้นฐานต่างๆ เหมาะสำหรับผู้ที่ไม่เคยถักมาก่อน",
      price: 590,
      published: true,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: "amigurumi-cute-animals" },
    update: {},
    create: {
      title: "ถักตุ๊กตา Amigurumi สัตว์น่ารัก",
      slug: "amigurumi-cute-animals",
      description:
        "เรียนรู้การถักตุ๊กตา Amigurumi รูปสัตว์น่ารักๆ ทั้งหมี กระต่าย แมว และอื่นๆ อีกมากมาย พร้อมเทคนิคการเย็บประกอบชิ้นส่วน",
      price: 890,
      published: true,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { slug: "crochet-bag-collection" },
    update: {},
    create: {
      title: "ถักกระเป๋าโครเชต์สุดชิค",
      slug: "crochet-bag-collection",
      description:
        "สอนถักกระเป๋าโครเชต์หลากหลายแบบ ทั้งกระเป๋าสะพาย กระเป๋าถือ กระเป๋าใส่โทรศัพท์ พร้อมเทคนิคการเก็บงานให้สวย",
      price: 790,
      published: true,
    },
  });

  const course4 = await prisma.course.upsert({
    where: { slug: "advanced-crochet-patterns" },
    update: {},
    create: {
      title: "ลายถักโครเชต์ขั้นสูง",
      slug: "advanced-crochet-patterns",
      description:
        "เรียนรู้ลายถักโครเชต์ขั้นสูง เช่น ลาย Granny Square, ลาย Ripple, ลาย Cable และลายอื่นๆ สำหรับผู้ที่มีพื้นฐานแล้ว",
      price: 1290,
      published: false,
    },
  });
  console.log("✅ สร้างคอร์สตัวอย่าง 4 คอร์ส");

  // ==========================================
  // สร้างบทเรียนตัวอย่าง
  // ==========================================
  // คอร์ส 1: โครเชต์เบื้องต้น
  await prisma.lesson.createMany({
    data: [
      {
        title: "รู้จักอุปกรณ์การถักโครเชต์",
        description: "แนะนำเข็มโครเชต์ขนาดต่างๆ ไหมพรม และอุปกรณ์เสริมที่จำเป็น",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 1,
        courseId: course1.id,
      },
      {
        title: "วิธีจับเข็มและร้อยไหม",
        description: "เทคนิคการจับเข็มที่ถูกต้อง และวิธีร้อยไหมเพื่อเริ่มถัก",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 2,
        courseId: course1.id,
      },
      {
        title: "ถักลูกโซ่ (Chain Stitch)",
        description: "เรียนรู้การถักลูกโซ่ ซึ่งเป็นพื้นฐานสำคัญที่สุดของการถักโครเชต์",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 3,
        courseId: course1.id,
      },
      {
        title: "ถักเข็มสั้น (Single Crochet)",
        description: "วิธีการถักเข็มสั้น พร้อมฝึกถักเป็นแถวตรง",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 4,
        courseId: course1.id,
      },
      {
        title: "ถักเข็มยาว (Double Crochet)",
        description: "วิธีการถักเข็มยาว และความแตกต่างจากเข็มสั้น",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 5,
        courseId: course1.id,
      },
    ],
    skipDuplicates: true,
  });

  // คอร์ส 2: Amigurumi
  await prisma.lesson.createMany({
    data: [
      {
        title: "พื้นฐาน Amigurumi - Magic Ring",
        description: "เรียนรู้การเริ่มต้นด้วย Magic Ring ซึ่งเป็นหัวใจของการถัก Amigurumi",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 1,
        courseId: course2.id,
      },
      {
        title: "ถักหัวหมีน้อย",
        description: "สอนถักหัวหมีทีละขั้นตอน พร้อมเทคนิคการเพิ่มและลดตา",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 2,
        courseId: course2.id,
      },
      {
        title: "ถักตัวและแขนขาหมี",
        description: "ถักส่วนตัว แขน และขาของตุ๊กตาหมี",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 3,
        courseId: course2.id,
      },
      {
        title: "ประกอบชิ้นส่วนและตกแต่ง",
        description: "เย็บประกอบชิ้นส่วนต่างๆ เข้าด้วยกัน เพิ่มตา จมูก และรายละเอียด",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 4,
        courseId: course2.id,
      },
    ],
    skipDuplicates: true,
  });

  // คอร์ส 3: กระเป๋าโครเชต์
  await prisma.lesson.createMany({
    data: [
      {
        title: "เลือกไหมและเข็มสำหรับถักกระเป๋า",
        description: "แนะนำไหมและเข็มที่เหมาะกับการถักกระเป๋า เพื่อให้ได้งานที่แข็งแรง",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 1,
        courseId: course3.id,
      },
      {
        title: "ถักกระเป๋าใส่โทรศัพท์",
        description: "โปรเจกต์เริ่มต้นง่ายๆ ถักกระเป๋าใส่โทรศัพท์มือถือ",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 2,
        courseId: course3.id,
      },
      {
        title: "ถักกระเป๋าสะพายข้าง",
        description: "สอนถักกระเป๋าสะพายข้างพร้อมสายสะพาย",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        position: 3,
        courseId: course3.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ สร้างบทเรียนตัวอย่างทั้งหมด");

  // ==========================================
  // สร้าง Enrollment ตัวอย่าง
  // ==========================================
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: student1.id, courseId: course1.id },
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course1.id,
      status: "ACTIVE",
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: student2.id, courseId: course1.id },
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course1.id,
      status: "ACTIVE",
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: student2.id, courseId: course2.id },
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course2.id,
      status: "ACTIVE",
    },
  });
  console.log("✅ สร้าง Enrollment ตัวอย่าง");

  // ==========================================
  // สร้าง Cart ตัวอย่าง
  // ==========================================
  await prisma.cart.upsert({
    where: { userId: student1.id },
    update: {},
    create: {
      userId: student1.id,
    },
  });

  await prisma.cart.upsert({
    where: { userId: student2.id },
    update: {},
    create: {
      userId: student2.id,
    },
  });

  await prisma.cart.upsert({
    where: { userId: student3.id },
    update: {},
    create: {
      userId: student3.id,
    },
  });
  console.log("✅ สร้างตะกร้าให้นักเรียนทุกคน");

  console.log("\n🎉 สร้างข้อมูลตัวอย่างเสร็จสมบูรณ์!");
  console.log("📧 Admin: test@test.com / admin123");
  console.log("📧 นักเรียน: somchai@example.com / student123");
  console.log("📧 นักเรียน: somying@example.com / student123");
  console.log("📧 นักเรียน: manee@example.com / student123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

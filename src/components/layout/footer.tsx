import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-brand-dark mb-3">
              รักไหมแม่ Academy
            </h3>
            <p className="text-sm text-gray-600">
              เรียนรู้การถักโครเชต์ออนไลน์ ตั้งแต่เบื้องต้นจนถึงขั้นสูง
              กับคอร์สคุณภาพจากผู้เชี่ยวชาญ
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">เมนู</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/courses" className="hover:text-brand-dark">
                  คอร์สทั้งหมด
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-dark">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-dark">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="https://lin.ee/oxHGACz" target="_blank" rel="noopener noreferrer" className="hover:text-brand-dark">
                  Line: ติดต่อเรา
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/Yarn.by.kuikui/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-dark">
                  Facebook: ไหมพรมราคาถูก รักไหมแม่ Yarn by Kuikui
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} รักไหมแม่ Academy.
          สงวนลิขสิทธิ์ทุกประการ
        </div>
      </div>
    </footer>
  );
}

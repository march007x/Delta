import Link from "next/link";
import { InteractiveQuadratic } from "@/components/viz/InteractiveQuadratic";
import { getCourses, getPublishedLessons, getTopics, getChapters } from "@/lib/repo/content";
import { SITE } from "@/lib/site";
import { Badge } from "@/components/ui/Badge";

const PAINS = [
  { q: "จำสูตรได้ แต่พอเจอโจทย์แล้วไม่รู้ว่าจะใช้สูตรไหน", why: "เพราะเรียนสูตรมาโดยไม่เคยเห็นว่ามันมาจากไหน" },
  { q: "ทำตามตัวอย่างได้ แต่เปลี่ยนโจทย์นิดเดียวก็ตัน", why: "เพราะจำวิธีทำ ไม่ได้จำเหตุผลของแต่ละขั้น" },
  { q: "เห็นกราฟแล้วนึกภาพไม่ออกว่ามันหมายถึงอะไร", why: "เพราะเคยเห็นแต่ภาพนิ่ง ไม่เคยได้ลองขยับมันเอง" },
  { q: "รู้ว่าตัวเองไม่เข้าใจ แต่ไม่รู้ว่าต้องกลับไปเรียนบทไหน", why: "เพราะไม่มีใครบอกว่าเรื่องไหนเป็นพื้นฐานของเรื่องไหน" },
];

const LOOP = [
  { step: "เรียน", detail: "เริ่มจากคำถามว่าทำไมต้องมีแนวคิดนี้ ไม่ได้เริ่มจากสูตร" },
  { step: "เห็นภาพ", detail: "ปรับค่าเองแล้วดูกราฟตอบสนองทันที" },
  { step: "พิสูจน์", detail: "ไล่ที่มาของสูตรทีละบรรทัดจนเห็นว่ามันไม่ได้ลอยมา" },
  { step: "ฝึก", detail: "ทำโจทย์พร้อมคำอธิบายว่าทำไมตัวเลือกอื่นถึงผิด" },
  { step: "ทบทวน", detail: "รู้ว่าจุดไหนพลาดบ่อย และควรกลับไปดูอะไร" },
];

const COMPARE: Array<[string, string]> = [
  ["ท่องสูตรไว้ก่อน เข้าใจทีหลัง", "เข้าใจก่อน แล้วสูตรจะจำได้เอง"],
  ["ภาพนิ่งในหนังสือ", "กราฟที่ลากได้ ปรับค่าได้ คำนวณสด"],
  ["โจทย์แยกเล่มจากบทเรียน", "โจทย์อยู่ในบทเรียน ตรงจุดที่เพิ่งอธิบายจบ"],
  ["เฉลยบอกแค่ว่าตอบข้อไหน", "เฉลยบอกว่าทำไมข้ออื่นถึงผิด"],
  ["ไม่รู้ว่าพื้นฐานตรงไหนหาย", "ทุกบทบอกชัดว่าต้องแม่นอะไรมาก่อน"],
];

const JOURNEY = ["ปรับพื้นฐาน", "ม.4", "ม.5", "ม.6", "A-Level / TPAT3", "มหาวิทยาลัย"];

export default function HomePage() {
  const courses = getCourses();
  const published = getPublishedLessons();

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:py-20">
          <div>
            <p className="m-0 mb-4 font-mono text-[11.5px] uppercase tracking-[0.16em] text-accent-ink">
              {SITE.symbol} Interactive Mathematics
            </p>
            <h1 className="m-0 mb-5 font-display text-[clamp(30px,5.2vw,52px)] leading-[1.12] font-bold tracking-tight text-ink text-balance">
              จากคนที่ท่องสูตรได้แต่ทำโจทย์ไม่เป็น
              <br />
              สู่คนที่คิดเองได้
            </h1>
            <p className="m-0 mb-7 max-w-[52ch] text-[17px] leading-relaxed text-ink-2">
              {SITE.name} สอนคณิตศาสตร์ด้วยการให้คุณ <b className="font-medium text-ink">ลองขยับมันเอง</b> ก่อนจะเจอสูตร
              เพราะสิ่งที่คุณค้นพบเองด้วยมือ จะอยู่กับคุณนานกว่าสิ่งที่ท่องมา
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-lg bg-accent px-5 py-2.5 text-[15px] font-medium text-white no-underline hover:opacity-90"
              >
                เริ่มเรียนฟรี
              </Link>
              <Link
                href="#demo"
                className="rounded-lg border border-line-strong bg-surface px-5 py-2.5 text-[15px] font-medium text-ink no-underline hover:border-accent"
              >
                ลองเล่นกราฟก่อน
              </Link>
            </div>
            <p className="m-0 mt-5 font-mono text-[12px] text-ink-3">
              ไม่ต้องสมัครสมาชิก · ไม่มีค่าใช้จ่าย · เปิดใช้ได้ทันที
            </p>
          </div>

          <div id="demo" className="min-w-0 scroll-mt-20">
            <InteractiveQuadratic height={320} />
          </div>
        </div>
      </section>

      {/* ---------- Problem ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="m-0 mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-3">ปัญหา</p>
        <h2 className="m-0 mb-8 max-w-[24ch] font-display text-[clamp(22px,3.2vw,32px)] font-semibold tracking-tight text-ink text-balance">
          ปัญหาส่วนใหญ่ไม่ได้อยู่ที่ความขยัน แต่อยู่ที่ลำดับการเรียน
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PAINS.map((p) => (
            <div key={p.q} className="rounded-[10px] border border-line bg-surface p-5">
              <p className="m-0 mb-2 font-display text-[16px] font-semibold leading-snug text-ink">
                “{p.q}”
              </p>
              <p className="m-0 text-[14.5px] leading-relaxed text-ink-3">{p.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Solution loop ---------- */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="m-0 mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-3">
            วิธีของเรา
          </p>
          <h2 className="m-0 mb-8 font-display text-[clamp(22px,3.2vw,32px)] font-semibold tracking-tight text-ink">
            ทุกบทเดินตามลำดับเดียวกัน
          </h2>
          <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-5">
            {LOOP.map((l, i) => (
              <li key={l.step} className="rounded-[10px] border border-line bg-bg p-4">
                <p className="m-0 mb-1.5 font-mono text-[11px] text-accent-ink">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="m-0 mb-1 font-display text-[16px] font-semibold text-ink">{l.step}</p>
                <p className="m-0 text-[13.5px] leading-relaxed text-ink-3">{l.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Compare ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="m-0 mb-8 font-display text-[clamp(22px,3.2vw,32px)] font-semibold tracking-tight text-ink">
          ต่างจากการเรียนแบบเดิมตรงไหน
        </h2>
        <div className="overflow-x-auto rounded-[10px] border border-line bg-surface">
          <table className="w-full min-w-[520px] border-collapse text-[15px]">
            <thead>
              <tr>
                <th className="w-1/2 border-b border-line-strong bg-surface-2 px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
                  การเรียนแบบเดิม
                </th>
                <th className="border-b border-line-strong bg-surface-2 px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent-ink">
                  {SITE.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([a, b]) => (
                <tr key={a}>
                  <td className="border-b border-line px-4 py-3 align-top text-ink-3">{a}</td>
                  <td className="border-b border-line px-4 py-3 align-top font-medium text-ink">
                    {b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- Journey ---------- */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="m-0 mb-6 font-display text-[clamp(22px,3.2vw,32px)] font-semibold tracking-tight text-ink">
            เส้นทางที่วางไว้
          </h2>
          <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
            {JOURNEY.map((j, i) => (
              <li key={j} className="flex items-center gap-2">
                <span className="rounded-lg border border-line-strong bg-bg px-3.5 py-1.5 text-[14px] text-ink">
                  {j}
                </span>
                {i < JOURNEY.length - 1 ? (
                  <span aria-hidden className="font-mono text-ink-3">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="m-0 mt-5 max-w-[62ch] text-[14.5px] text-ink-3">
            ตอนนี้เปิดแล้ว {published.length} บทเรียน จากแผนทั้งหมด 24 บท — เนื้อหาถูกเพิ่มทีละบท
            และบทที่เปิดแล้วจะสมบูรณ์ครบทั้ง 13 ขั้นตอนการสอนเสมอ
          </p>
        </div>
      </section>

      {/* ---------- Courses ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="m-0 mb-8 font-display text-[clamp(22px,3.2vw,32px)] font-semibold tracking-tight text-ink">
          หลักสูตร
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {courses.map((c) => {
            const chapterCount = getChapters(c.id).length;
            const topicCount = getChapters(c.id).reduce((n, ch) => n + getTopics(ch.id).length, 0);
            return (
              <Link
                key={c.id}
                href={`/courses#${c.slug}`}
                className="rounded-[10px] border border-line bg-surface p-5 no-underline hover:border-accent"
              >
                <p className="m-0 mb-2">
                  <Badge tone="accent">{c.title}</Badge>
                </p>
                <p className="m-0 mb-3 text-[14.5px] leading-relaxed text-ink-2">{c.description}</p>
                <p className="m-0 font-mono text-[11.5px] text-ink-3">
                  {chapterCount} บท · {topicCount} หัวข้อในแผน
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-4">
        <div className="rounded-[12px] border border-accent bg-accent-soft px-7 py-9">
          <h2 className="m-0 mb-2 font-display text-[clamp(20px,3vw,28px)] font-semibold tracking-tight text-accent-ink">
            เริ่มจากบทเดียวก็พอ
          </h2>
          <p className="m-0 mb-5 max-w-[58ch] text-[15.5px] text-ink">
            ลองเรียน “ฟังก์ชันกำลังสอง” ให้จบสักบท แล้วดูว่าการเข้าใจที่มาของสูตร
            ให้ความรู้สึกต่างจากการท่องจำแค่ไหน
          </p>
          <Link
            href="/lesson/quadratic-function"
            className="inline-block rounded-lg bg-accent px-5 py-2.5 text-[15px] font-medium text-white no-underline hover:opacity-90"
          >
            เปิดบทเรียนแรก
          </Link>
        </div>
      </section>
    </>
  );
}

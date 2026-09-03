import { lessonSchema, type Lesson } from "./schema";
import { setBasic } from "./lessons/set-basic";
import { realNumberLine } from "./lessons/real-number-line";
import { functionBasic } from "./lessons/function-basic";
import { quadraticFunction } from "./lessons/quadratic-function";
import { unitCircle } from "./lessons/unit-circle";
import { derivativeIntro } from "./lessons/derivative-intro";

export { courses, chapters, topics } from "./structure";

/** เรียงตามลำดับที่ควรเรียน — ใช้ทำ "บทก่อนหน้า / บทถัดไป" ด้วย */
const RAW: Lesson[] = [
  setBasic,
  realNumberLine,
  functionBasic,
  quadraticFunction,
  unitCircle,
  derivativeIntro,
];

/**
 * ตรวจรูปแบบเนื้อหาตอน build — เนื้อหาที่ผิดโครงสร้างจะทำให้ build ล้ม
 * ดีกว่าปล่อยให้ผู้เรียนเจอหน้าพัง
 */
export const lessons: Lesson[] = RAW.map((l) => lessonSchema.parse(l));

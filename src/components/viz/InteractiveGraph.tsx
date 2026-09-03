"use client";

import { useCallback, useMemo, useState } from "react";
import { VizCanvas } from "./core/VizCanvas";
import { ParameterPanel, type ParamSpec } from "./core/ParameterPanel";
import { VizFrame, Readout } from "./core/VizFrame";
import { clear, drawAxes, drawGrid, plot } from "./core/draw";
import { fmt } from "@/lib/utils";

export type GraphFamily =
  | "linear"
  | "vertexForm"
  | "absolute"
  | "reciprocal"
  | "exponential"
  | "sine";

interface FamilyDef {
  title: string;
  caption: string;
  latex: (p: Record<string, number>) => string;
  fn: (p: Record<string, number>) => (x: number) => number;
  specs: readonly ParamSpec[];
  defaults: Record<string, number>;
  extra?: (p: Record<string, number>) => Array<{ label: string; value: string }>;
}

const g = (p: Record<string, number>, k: string, d = 0) => p[k] ?? d;

const FAMILIES: Record<GraphFamily, FamilyDef> = {
  linear: {
    title: "เส้นตรง y = mx + c",
    caption: "m คือความชัน — ค่าที่บอกว่า y เปลี่ยนเท่าไรเมื่อ x เพิ่มขึ้น 1",
    latex: (p) => `y = ${fmt(g(p, "m"))}x ${g(p, "c") < 0 ? "-" : "+"} ${fmt(Math.abs(g(p, "c")))}`,
    fn: (p) => (x) => g(p, "m") * x + g(p, "c"),
    specs: [
      { key: "m", label: "m (ความชัน)", min: -5, max: 5, step: 0.1 },
      { key: "c", label: "c (จุดตัดแกน y)", min: -6, max: 6, step: 0.1 },
    ],
    defaults: { m: 1, c: 0 },
    extra: (p) => [
      { label: "ตัดแกน y", value: `(0, ${fmt(g(p, "c"))})` },
      {
        label: "ตัดแกน x",
        value: g(p, "m") === 0 ? "ไม่ตัด" : `(${fmt(-g(p, "c") / g(p, "m"))}, 0)`,
      },
    ],
  },
  vertexForm: {
    title: "รูปจุดยอด y = a(x − h)² + k",
    caption: "รูปนี้อ่านจุดยอดได้ทันทีจากตัวเลข ต่างจากรูป ax² + bx + c ที่ต้องคำนวณก่อน",
    latex: (p) => `y = ${fmt(g(p, "a"))}(x - ${fmt(g(p, "h"))})^2 + ${fmt(g(p, "k"))}`,
    fn: (p) => (x) => g(p, "a") * (x - g(p, "h")) ** 2 + g(p, "k"),
    specs: [
      { key: "a", label: "a", min: -3, max: 3, step: 0.1, hint: "บวก = หงาย, ลบ = คว่ำ" },
      { key: "h", label: "h", min: -6, max: 6, step: 0.1, hint: "เลื่อนซ้ายขวา" },
      { key: "k", label: "k", min: -6, max: 6, step: 0.1, hint: "เลื่อนขึ้นลง" },
    ],
    defaults: { a: 1, h: 0, k: 0 },
    extra: (p) => [{ label: "จุดยอด", value: `(${fmt(g(p, "h"))}, ${fmt(g(p, "k"))})` }],
  },
  absolute: {
    title: "ค่าสัมบูรณ์ y = a|x − h| + k",
    caption: "รูปตัว V — จุดหักคือจุดที่ค่าในเครื่องหมายเป็นศูนย์พอดี",
    latex: (p) => `y = ${fmt(g(p, "a"))}|x - ${fmt(g(p, "h"))}| + ${fmt(g(p, "k"))}`,
    fn: (p) => (x) => g(p, "a") * Math.abs(x - g(p, "h")) + g(p, "k"),
    specs: [
      { key: "a", label: "a", min: -3, max: 3, step: 0.1 },
      { key: "h", label: "h", min: -6, max: 6, step: 0.1 },
      { key: "k", label: "k", min: -6, max: 6, step: 0.1 },
    ],
    defaults: { a: 1, h: 0, k: 0 },
    extra: (p) => [{ label: "จุดหัก", value: `(${fmt(g(p, "h"))}, ${fmt(g(p, "k"))})` }],
  },
  reciprocal: {
    title: "ฟังก์ชันเศษส่วน y = a/(x − h) + k",
    caption: "สังเกตเส้นกำกับ: กราฟเข้าใกล้แต่ไม่มีวันแตะ x = h และ y = k",
    latex: (p) => `y = \\dfrac{${fmt(g(p, "a"))}}{x - ${fmt(g(p, "h"))}} + ${fmt(g(p, "k"))}`,
    fn: (p) => (x) => g(p, "a") / (x - g(p, "h")) + g(p, "k"),
    specs: [
      { key: "a", label: "a", min: -6, max: 6, step: 0.1 },
      { key: "h", label: "h", min: -5, max: 5, step: 0.1 },
      { key: "k", label: "k", min: -5, max: 5, step: 0.1 },
    ],
    defaults: { a: 1, h: 0, k: 0 },
    extra: (p) => [
      { label: "เส้นกำกับตั้ง", value: `x = ${fmt(g(p, "h"))}` },
      { label: "เส้นกำกับนอน", value: `y = ${fmt(g(p, "k"))}` },
    ],
  },
  exponential: {
    title: "เอกซ์โพเนนเชียล y = a · bˣ",
    caption: "b > 1 คือการเติบโต, 0 < b < 1 คือการสลายตัว — ลองเลื่อน b ข้าม 1 ดู",
    latex: (p) => `y = ${fmt(g(p, "a"))} \\cdot ${fmt(g(p, "b"))}^{x}`,
    fn: (p) => (x) => g(p, "a") * Math.pow(Math.max(g(p, "b"), 0.05), x),
    specs: [
      { key: "a", label: "a", min: -4, max: 4, step: 0.1 },
      { key: "b", label: "b (ฐาน)", min: 0.1, max: 4, step: 0.05 },
    ],
    defaults: { a: 1, b: 2 },
    extra: (p) => [
      { label: "ผ่านจุด", value: `(0, ${fmt(g(p, "a"))})` },
      { label: "ลักษณะ", value: g(p, "b") > 1 ? "เติบโต" : g(p, "b") < 1 ? "สลายตัว" : "คงที่" },
    ],
  },
  sine: {
    title: "คลื่นไซน์ y = A sin(Bx + C)",
    caption: "A คือแอมพลิจูด, B ควบคุมคาบ, C เลื่อนเฟส — ทั้งสามค่านี้ใช้ต่อในคลื่นเสียงและไฟฟ้ากระแสสลับ",
    latex: (p) => `y = ${fmt(g(p, "A"))}\\sin(${fmt(g(p, "B"))}x + ${fmt(g(p, "C"))})`,
    fn: (p) => (x) => g(p, "A") * Math.sin(g(p, "B") * x + g(p, "C")),
    specs: [
      { key: "A", label: "A (แอมพลิจูด)", min: -4, max: 4, step: 0.1 },
      { key: "B", label: "B", min: 0.1, max: 4, step: 0.1 },
      { key: "C", label: "C (เฟส)", min: -3.2, max: 3.2, step: 0.1 },
    ],
    defaults: { A: 2, B: 1, C: 0 },
    extra: (p) => [
      { label: "แอมพลิจูด", value: fmt(Math.abs(g(p, "A"))) },
      { label: "คาบ", value: `${fmt((2 * Math.PI) / Math.max(Math.abs(g(p, "B")), 0.1))}` },
    ],
  },
};

interface Props {
  family: GraphFamily;
  height?: number;
  title?: string;
  caption?: string;
  initial?: Record<string, number>;
}

/** กราฟโต้ตอบทั่วไป — บทเรียนเรียกใช้ผ่าน registry โดยส่งแค่ชื่อ family กับค่าเริ่มต้น */
export function InteractiveGraph({ family, height = 320, title, caption, initial }: Props) {
  const def = FAMILIES[family];
  const start = useMemo(() => ({ ...def.defaults, ...initial }), [def.defaults, initial]);
  const [p, setP] = useState<Record<string, number>>(start);

  const fn = def.fn(p);
  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      vp: Parameters<typeof drawGrid>[1],
      theme: Parameters<typeof drawGrid>[2],
    ) => {
      clear(ctx, vp, theme);
      drawGrid(ctx, vp, theme);
      drawAxes(ctx, vp, theme);
      plot(ctx, vp, fn, { color: theme.curve, width: 2.5 });
    },
    [fn],
  );

  return (
    <VizFrame
      title={title ?? def.title}
      caption={caption ?? def.caption}
      canvas={
        <VizCanvas
          bounds={{ xMin: -8, xMax: 8, yMin: -6, yMax: 6 }}
          height={height}
          draw={draw}
          ariaLabel={`${def.title} โดยมีค่าปัจจุบันคือ ${def.specs
            .map((s) => `${s.label} = ${fmt(p[s.key] ?? 0)}`)
            .join(", ")}`}
        />
      }
      controls={
        <ParameterPanel
          specs={def.specs}
          values={p}
          onChange={(k, v) => setP((prev) => ({ ...prev, [k]: v }))}
          onReset={() => setP({ ...start })}
        />
      }
      readout={<Readout rows={def.extra ? def.extra(p) : []} />}
    />
  );
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** ปัดเลขให้อ่านง่ายบนหน้าจอ โดยไม่ทิ้งความหมายของค่าที่เล็กมาก */
export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-10) return "0";
  const r = Number(n.toFixed(digits));
  return Object.is(r, -0) ? "0" : String(r);
}

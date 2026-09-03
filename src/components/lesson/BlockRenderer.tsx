import type { Block } from "@/content/schema";
import { renderMath, renderRich } from "@/lib/math/render";
import { Callout } from "@/components/ui/Callout";
import { VizByKey } from "@/components/viz/registry";
import { Quiz } from "./Quiz";
import { Worked } from "./Worked";

/** เรนเดอร์บนเซิร์ฟเวอร์ทั้งหมด ยกเว้นส่วนที่ต้องโต้ตอบจริง ๆ (ควิซ ตัวอย่างทีละขั้น กราฟ) */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p
          className="my-3 max-w-[68ch] text-[16px] leading-[1.8] text-ink-2"
          dangerouslySetInnerHTML={{ __html: renderRich(block.text) }}
        />
      );

    case "math":
      return (
        <div className="my-4">
          <div
            className="overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderMath(block.latex, true) }}
          />
          {block.note ? (
            <p className="m-0 text-center font-mono text-[12px] text-ink-3">{block.note}</p>
          ) : null}
        </div>
      );

    case "list": {
      const cls = `my-3 max-w-[68ch] pl-5 text-[16px] leading-[1.8] text-ink-2 ${
        block.ordered ? "list-decimal" : "list-disc"
      }`;
      const items = block.items.map((item, i) => (
        <li key={i} className="mb-1.5" dangerouslySetInnerHTML={{ __html: renderRich(item) }} />
      ));
      return block.ordered ? <ol className={cls}>{items}</ol> : <ul className={cls}>{items}</ul>;
    }

    case "callout":
      return (
        <Callout tone={block.tone} title={block.title}>
          <p
            className="m-0 text-[15px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderRich(block.text) }}
          />
        </Callout>
      );

    case "viz":
      return <VizByKey componentKey={block.componentKey} config={block.config} />;

    case "worked":
      return (
        <Worked
          promptHtml={renderRich(block.prompt)}
          steps={block.steps.map((s) => ({
            textHtml: renderRich(s.text),
            latexHtml: s.latex ? renderMath(s.latex, true) : undefined,
          }))}
          answerHtml={renderMath(block.answer, true)}
        />
      );

    case "quiz":
      return (
        <Quiz
          promptHtml={renderRich(block.prompt)}
          choices={block.choices.map((c) => ({ html: renderRich(c.text), correct: c.correct }))}
          explainHtml={renderRich(block.explain)}
          hintHtml={block.hint ? renderRich(block.hint) : undefined}
        />
      );
  }
}

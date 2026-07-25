import type { RichText } from "@/lib/site/types";

/**
 * Renders JSON-serializable rich text segments. Each theme maps the
 * abstract style tokens ("em", "accent") to its own classes.
 */
export default function Rich({
  segments,
  styles,
}: {
  segments: RichText;
  styles?: Partial<Record<"em" | "accent", string>>;
}) {
  return (
    <>
      {segments.map((seg, i) => {
        const cls = seg.style ? styles?.[seg.style] : undefined;
        if (seg.href) {
          return (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {seg.text}
            </a>
          );
        }
        if (seg.style === "em") {
          return (
            <em key={i} className={cls}>
              {seg.text}
            </em>
          );
        }
        if (cls) {
          return (
            <span key={i} className={cls}>
              {seg.text}
            </span>
          );
        }
        return <span key={i}>{seg.text}</span>;
      })}
    </>
  );
}

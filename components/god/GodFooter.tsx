import type { FooterContent } from "@/lib/site/types";

export default function GodFooter({ content }: { content: FooterContent }) {
  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[110rem] flex-wrap items-center justify-between gap-4">
        <p className="god-deva text-sm text-muted">
          © {new Date().getFullYear()} {content.copyrightName}
        </p>
        <p className="text-sm italic text-muted">
          {content.akaPre}
          {content.akaHref ? (
            <a
              href={content.akaHref}
              className="not-italic text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {content.akaHighlight}
            </a>
          ) : (
            <span className="not-italic text-accent">
              {content.akaHighlight}
            </span>
          )}
        </p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {content.socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.url.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="label !text-foreground/70 transition-colors hover:!text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

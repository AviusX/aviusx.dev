import { socialLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[110rem] flex-wrap items-center justify-between gap-4">
        <p className="label !normal-case !tracking-normal">
          © {new Date().getFullYear()} Hrijul Bhatnagar
        </p>
        <p className="serif-accent text-sm text-muted">
          also known online as <span className="text-accent">AviusX</span>
        </p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {socialLinks.map((link) => (
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

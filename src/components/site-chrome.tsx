import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/steps", label: "Steps" },
  { href: "/myths", label: "The Paradoxes" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link className="flex items-center gap-2.5" href="/">
          <Image
            src="/assets/image.png"
            alt="Apocalypse Anonymous"
            width={128}
            height={64}
            className="h-7 w-auto shrink-0 object-contain"
            priority
          />
          <span className="text-sm font-medium tracking-normal">
            Apocalypse Anonymous
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="flex items-center gap-4 md:hidden">
          <Link
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            href="/steps"
          >
            Steps
          </Link>
          <Link
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            href="/contact"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
        <p className="text-xs text-muted-foreground">Apocalypse Anonymous</p>
        <p className="text-xs text-muted-foreground">We&apos;re Here, Now.</p>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-6">{children}</div>;
}

export function PageHero({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-normal md:text-5xl">
        {title}
      </h1>
      <div className="max-w-lg text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  );
}

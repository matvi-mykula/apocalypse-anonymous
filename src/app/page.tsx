import Image from "next/image";
import Link from "next/link";
import { PageShell, SectionLabel } from "@/components/site-chrome";
import { email, steps } from "@/lib/site-content";

export default function Home() {
  return (
    <PageShell>
      <section className="border-b border-border py-20 md:py-28">
        <div className="grid items-end gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-normal md:text-5xl">
              Apocalypse
              <br />
              Anonymous
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              A fellowship of apes and companion organisms - composed of air,
              water, earth, sun, cosmic debris, and dark matter - who share a
              collective experience of apocalypses.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The only requirement for membership is a willingness to want to be
              here.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Image
              src="/assets/image.png"
              alt="Apocalypse Anonymous"
              width={300}
              height={180}
              className="mb-4 h-32 w-auto self-end object-contain"
              priority
            />
            <div className="max-w-sm text-sm text-muted-foreground md:text-right">
              <p className="font-medium text-foreground">Meetings on Zoom</p>
              <p className="mt-1 leading-relaxed">
                Email{" "}
                <a
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>{" "}
                to be added to the mailing list for meeting updates.
              </p>
            </div>
            <Link
              className="mt-2 inline-flex text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
              href="/steps"
            >
              Read the steps →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            The Twelve Steps
          </h2>
          <Link
            className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            href="/steps"
          >
            View all
          </Link>
        </div>
        <ol className="grid gap-x-16 md:grid-cols-2">
          {steps.map((step, index) => (
            <li
              className="flex gap-4 border-b border-border py-4"
              key={step.title}
            >
              <span className="w-4 shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground/50">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-b border-border py-16">
        <SectionLabel>Literature</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <a
            className="group flex items-center justify-between border border-border px-5 py-4 transition-colors hover:border-foreground"
            href="/data/trifold1.pdf"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-sm text-foreground">The Twelve Steps</span>
            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              Download PDF →
            </span>
          </a>
          <a
            className="group flex items-center justify-between border border-border px-5 py-4 transition-colors hover:border-foreground"
            href="/data/trifold2.pdf"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-sm text-foreground">The Paradoxes</span>
            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              Download PDF →
            </span>
          </a>
        </div>
      </section>

      <section className="grid gap-12 py-16 md:grid-cols-3">
        <div>
          <SectionLabel>About</SectionLabel>
          <p className="text-sm leading-relaxed text-muted-foreground">
            AA considers all sects, denominations, politics, organizations, and
            institutions; offers accompaniment with controversy; and neither
            endorses nor opposes any causes.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Our primary purpose is to commune with our endings and abide others
            doing the same.
          </p>
          <Link
            className="mt-4 inline-block text-xs text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            href="/about"
          >
            Learn more →
          </Link>
        </div>
        <div>
          <SectionLabel>Membership</SectionLabel>
          <p className="text-sm leading-relaxed text-muted-foreground">
            There are no fees to join AA, but there may be a cost.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The only requirement is a willingness to want to be here.
          </p>
        </div>
        <div>
          <SectionLabel>Meeting</SectionLabel>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Meetings on Zoom.
            <br />
            Email{" "}
            <a
              className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
              href={`mailto:${email}`}
            >
              {email}
            </a>{" "}
            to be added to the mailing list for updates.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

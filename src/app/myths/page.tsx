import type { Metadata } from "next";
import { PageHero, PageShell } from "@/components/site-chrome";
import { paradoxes } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "The Paradoxes",
  description:
    "We acknowledge the value of inhabiting seemingly irrational spaces as expressed by the real quality of the following paradoxes.",
};

export default function MythsPage() {
  return (
    <PageShell>
      <PageHero title="The Paradoxes">
        We acknowledge the value of inhabiting seemingly irrational spaces as
        expressed by the real quality of the following paradoxes.
      </PageHero>
      <section className="py-16">
        <ol>
          {paradoxes.map((paradox, index) => (
            <li
              className="flex items-baseline gap-8 border-b border-border py-6 last:border-b-0"
              key={paradox}
            >
              <span className="w-4 shrink-0 text-xs tabular-nums text-muted-foreground/40">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {paradox}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}

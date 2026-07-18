import type { Metadata } from "next";
import { PageHero, PageShell } from "@/components/site-chrome";
import { steps } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "The Twelve Steps",
  description:
    "The twelve steps as we work them. The language has been adapted. The work has not.",
};

export default function StepsPage() {
  return (
    <PageShell>
      <PageHero title="The Twelve Steps">
        The language has been adapted. The work has not.
      </PageHero>
      <section className="py-16">
        <ol>
          {steps.map((step, index) => (
            <li
              className="grid items-baseline gap-4 border-b border-border py-6 last:border-b-0 md:grid-cols-[2rem_8rem_1fr] md:gap-8"
              key={step.title}
            >
              <span className="text-xs tabular-nums text-muted-foreground/40">
                {index + 1}
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {step.title}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}

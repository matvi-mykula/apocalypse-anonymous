import type { Metadata } from "next";
import { PageHero, PageShell, SectionLabel } from "@/components/site-chrome";
import { email } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get meeting updates. Email info@apocalypseanonymous.com to be added to the mailing list.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero title="Contact">
        Meetings are held on Zoom. To receive meeting links and updates, join
        the mailing list.
      </PageHero>

      <section className="grid gap-12 border-b border-border py-16 md:grid-cols-2">
        <div>
          <SectionLabel>Mailing List</SectionLabel>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Email us to be added to the list. You&apos;ll receive Zoom links and
            any updates about meeting times.
          </p>
          <a
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </div>
        <div>
          <SectionLabel>Meetings</SectionLabel>
          <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">On Zoom</p>
            <p>Free. No sign-up required beyond joining the mailing list.</p>
            <p className="mt-2">
              The only requirement for membership is a willingness to want to be
              here.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

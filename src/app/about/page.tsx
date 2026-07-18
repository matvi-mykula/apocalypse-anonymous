import type { Metadata } from "next";
import { PageHero, PageShell, SectionLabel } from "@/components/site-chrome";
import { email, values } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About",
  description: "Who we are and why we meet.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero title="About">
        Apocalypse Anonymous is a fellowship of apes and companion organisms who
        are composed of air, water, earth, sun, cosmic debris, and dark matter
        who share a collective experience of apocalypses.
      </PageHero>

      <section className="grid gap-12 border-b border-border py-16 md:grid-cols-2">
        <div>
          <SectionLabel>Membership</SectionLabel>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              The only requirement for membership is a willingness to want to be
              here. There are no fees to join AA but there may be a cost.
            </p>
            <p>
              AA considers all sects, denominations, politics, organizations,
              and institutions; offers accompaniment with controversy; and
              neither endorses nor opposes any causes.
            </p>
            <p>
              Our primary purpose is to commune with our endings and abide
              others doing the same.
            </p>
          </div>
        </div>
        <div>
          <SectionLabel>Who Is Welcome</SectionLabel>
          <ul className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            {[
              "Apes and companion organisms of all kinds.",
              "Those composed of air, water, earth, sun, cosmic debris, and dark matter.",
              "People of all sects, denominations, politics, and institutions.",
              "Anyone with a willingness to want to be here.",
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <span className="shrink-0 text-border">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-12 py-16 md:grid-cols-2">
        <div>
          <SectionLabel>What We Hold</SectionLabel>
          <div>
            {values.map((value) => (
              <div
                className="border-b border-border py-4 last:border-b-0"
                key={value.title}
              >
                <p className="mb-1 text-xs font-medium text-foreground">
                  {value.title}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel>Meeting</SectionLabel>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">Meetings on Zoom</p>
            <p>
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
        </div>
      </section>
    </PageShell>
  );
}

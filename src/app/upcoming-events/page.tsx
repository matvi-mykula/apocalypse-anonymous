import type { Metadata } from "next";
import { PageHero, PageShell, SectionLabel } from "@/components/site-chrome";
import {
  formatEventDate,
  formatEventTime,
  getUpcomingEvents,
  MarkdownBody,
} from "@/lib/events";
import { email } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Upcoming Apocalypse Anonymous events and gatherings.",
};

export const revalidate = 3600;

export default async function UpcomingEventsPage() {
  const events = await getUpcomingEvents();

  return (
    <PageShell>
      <PageHero title="Upcoming Events">
        Gatherings, meetings, and occasions for practicing presence with endings.
      </PageHero>

      <section className="py-14">
        <SectionLabel>Calendar</SectionLabel>
        {events.length > 0 ? (
          <ol className="grid gap-4">
            {events.map((event) => {
              const time = formatEventTime(event);

              return (
                <li
                  className="grid gap-5 border border-border px-5 py-5 md:grid-cols-[10rem_1fr] md:px-6"
                  key={event.slug}
                >
                  <div className="text-sm leading-snug">
                    <p className="font-medium text-foreground">
                      {formatEventDate(event.date)}
                    </p>
                    {time ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {time}
                      </p>
                    ) : null}
                    {event.location ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.location}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium leading-snug tracking-normal text-foreground">
                      {event.title}
                    </h2>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {event.summary}
                    </p>
                    <div className="mt-3 max-w-2xl">
                      <MarkdownBody markdown={event.bodyMarkdown} />
                    </div>
                    {event.registrationUrl ? (
                      <a
                        className="mt-4 inline-flex text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                        href={event.registrationUrl}
                        rel={
                          event.registrationUrl.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        target={
                          event.registrationUrl.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                      >
                        Details / RSVP
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            <p>No upcoming events are currently listed.</p>
            <p className="mt-3">
              Email{" "}
              <a
                className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                href={`mailto:${email}`}
              >
                {email}
              </a>{" "}
              to join the mailing list for updates.
            </p>
          </div>
        )}
      </section>
    </PageShell>
  );
}

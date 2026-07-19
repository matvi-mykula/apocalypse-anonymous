import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

type EventRecord = {
  type: "event";
  status: "draft" | "published" | "archived";
  slug: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  location?: string;
  summary: string;
  body: string;
  registrationUrl?: string;
  missingFields?: string[];
  source?: {
    kind: "email" | "manual" | "sample";
    note?: string;
    threadId?: string;
  };
};

export type UpcomingEvent = EventRecord & {
  bodyMarkdown: string;
};

const eventsDirectory = path.join(process.cwd(), "content", "events");

function getTodayInNewYork() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isValidDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function sortByDate(first: EventRecord, second: EventRecord) {
  return first.date.localeCompare(second.date);
}

async function readEventsIndex() {
  let entries: Array<{ isDirectory(): boolean; name: string }>;

  try {
    entries = await fs.readdir(eventsDirectory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const events = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const eventDirectory = path.join(eventsDirectory, entry.name);
        const eventPath = path.join(eventDirectory, "event.json");
        const source = await fs.readFile(eventPath, "utf8");

        return {
          eventDirectory,
          event: JSON.parse(source) as EventRecord,
        };
      }),
  );

  return events.filter((event) => {
    if (
      event.event.type !== "event" ||
      event.event.status !== "published" ||
      !event.event.slug ||
      !event.event.title ||
      !event.event.summary ||
      !event.event.body
    ) {
      return false;
    }

    return isValidDate(event.event.date);
  });
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  const today = getTodayInNewYork();
  const entries = await readEventsIndex();
  const upcomingEvents = entries
    .filter((event) => event.event.date >= today)
    .sort((first, second) => sortByDate(first.event, second.event));

  return Promise.all(
    upcomingEvents.map(async ({ event, eventDirectory }) => ({
      ...event,
      bodyMarkdown: await fs.readFile(
        path.join(eventDirectory, event.body),
        "utf8",
      ),
    })),
  );
}

export function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function formatEventTime(event: UpcomingEvent) {
  if (!event.startTime) {
    return null;
  }

  const time = event.endTime
    ? `${formatClockTime(event.startTime)} - ${formatClockTime(event.endTime)}`
    : formatClockTime(event.startTime);

  return event.timezone ? `${time} ${event.timezone}` : time;
}

function formatClockTime(time: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    return time;
  }

  const [, hourText, minute] = match;
  const hour = Number(hourText);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (!link) {
      return part;
    }

    const [, label, href] = link;

    if (href.startsWith("/") || href.startsWith("mailto:")) {
      return (
        <Link
          className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          href={href}
          key={`${href}-${index}`}
        >
          {label}
        </Link>
      );
    }

    return (
      <a
        className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
        href={href}
        key={`${href}-${index}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {label}
      </a>
    );
  });
}

export function MarkdownBody({ markdown }: { markdown: string }) {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
      {blocks.map((block) => {
        if (block.startsWith("### ")) {
          return (
            <h3
              className="pt-2 text-xs font-medium uppercase tracking-widest text-foreground"
              key={block}
            >
              {block.replace(/^### /, "")}
            </h3>
          );
        }

        return <p key={block}>{renderInlineMarkdown(block)}</p>;
      })}
    </div>
  );
}

import fs from "node:fs/promises";
import path from "node:path";

export const EVENT_STATUSES = new Set(["draft", "published", "archived"]);

export function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];

    if (!item.startsWith("--")) {
      continue;
    }

    const [rawKey, inlineValue] = item.slice(2).split("=", 2);
    const key = normalizeKey(rawKey.trim());

    if (!key) {
      continue;
    }

    if (inlineValue !== undefined) {
      args[key] = inlineValue;
      continue;
    }

    const nextValue = argv[index + 1];

    if (!nextValue || nextValue.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = nextValue;
    index += 1;
  }

  return args;
}

export function normalizeKey(key) {
  const aliases = {
    "body-file": "bodyFile",
    "dry-run": "dryRun",
    "end-time": "endTime",
    "missing-fields": "missingFields",
    "registration-url": "registrationUrl",
    "source-kind": "sourceKind",
    "source-note": "sourceNote",
    "start-time": "startTime",
    "time-zone": "timezone",
  };

  return aliases[key] || key;
}

export function splitList(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));

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

export function isValidTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value));
}

export function isSafeHref(value) {
  const href = String(value);

  if (href.startsWith("/")) {
    return !href.startsWith("//");
  }

  return (
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function writeJsonFile(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readEventManifests(root = process.cwd()) {
  const eventsRoot = path.join(root, "content", "events");

  if (!(await pathExists(eventsRoot))) {
    return [];
  }

  const entries = await fs.readdir(eventsRoot, { withFileTypes: true });
  const manifests = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const directory = path.join(eventsRoot, entry.name);
    const manifestPath = path.join(directory, "event.json");

    if (!(await pathExists(manifestPath))) {
      manifests.push({
        directory,
        manifest: null,
        manifestPath,
        slug: entry.name,
        parseError: new Error("Missing event.json."),
      });
      continue;
    }

    try {
      const source = await fs.readFile(manifestPath, "utf8");
      manifests.push({
        directory,
        manifest: JSON.parse(source),
        manifestPath,
        slug: entry.name,
      });
    } catch (error) {
      manifests.push({
        directory,
        manifest: null,
        manifestPath,
        slug: entry.name,
        parseError: error,
      });
    }
  }

  return manifests;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export async function validateEvents(root = process.cwd()) {
  const findings = [];
  const manifests = await readEventManifests(root);
  const slugCounts = new Map();

  for (const entry of manifests) {
    if (entry.parseError) {
      findings.push({
        level: "error",
        event: entry.slug,
        message: entry.parseError.message,
      });
      continue;
    }

    const event = entry.manifest;
    const eventSlug = event?.slug ?? entry.slug;

    for (const field of ["type", "status", "slug", "title", "date", "summary", "body"]) {
      if (!isNonEmptyString(event?.[field])) {
        findings.push({
          level: "error",
          event: eventSlug,
          message: `Missing ${field}.`,
        });
      }
    }

    if (event?.type !== "event") {
      findings.push({
        level: "error",
        event: eventSlug,
        message: 'type must be "event".',
      });
    }

    if (event?.status && !EVENT_STATUSES.has(event.status)) {
      findings.push({
        level: "error",
        event: eventSlug,
        message: "status must be draft, published, or archived.",
      });
    }

    if (event?.slug && event.slug !== entry.slug) {
      findings.push({
        level: "error",
        event: eventSlug,
        message: `slug must match folder name "${entry.slug}".`,
      });
    }

    if (event?.date && !isValidDate(event.date)) {
      findings.push({
        level: "error",
        event: eventSlug,
        message: "date must be a valid YYYY-MM-DD value.",
      });
    }

    for (const field of ["startTime", "endTime"]) {
      if (event?.[field] && !isValidTime(event[field])) {
        findings.push({
          level: "error",
          event: eventSlug,
          message: `${field} must use 24-hour HH:mm format.`,
        });
      }
    }

    if (event?.registrationUrl && !isSafeHref(event.registrationUrl)) {
      findings.push({
        level: "error",
        event: eventSlug,
        message: "registrationUrl must be an internal path, https URL, mailto link, or telephone link.",
      });
    }

    if (event?.body) {
      const bodyPath = path.join(entry.directory, event.body);

      if (!(await pathExists(bodyPath))) {
        findings.push({
          level: "error",
          event: eventSlug,
          message: `Missing body file "${event.body}".`,
        });
      }
    }

    if (event?.slug) {
      slugCounts.set(event.slug, (slugCounts.get(event.slug) ?? 0) + 1);
    }
  }

  for (const [slug, count] of slugCounts) {
    if (count > 1) {
      findings.push({
        level: "error",
        event: slug,
        message: "Duplicate event slug.",
      });
    }
  }

  return findings;
}

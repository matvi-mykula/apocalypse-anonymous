#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { pathToFileURL } from "node:url";
import {
  parseArgs,
  pathExists,
  slugify,
  splitList,
  validateEvents,
  writeJsonFile,
} from "./events-workflow.mjs";

const requiredFields = ["title", "date", "summary"];

function assertRequiredFields(event) {
  const missingFields = requiredFields.filter((field) => !event[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required field(s): ${missingFields.join(", ")}`);
  }
}

async function promptForMissingFields(args) {
  const rl = readline.createInterface({ input, output });
  const event = { ...args };

  try {
    for (const field of requiredFields) {
      if (!event[field]) {
        event[field] = await rl.question(`${field}: `);
      }
    }

    for (const field of [
      "startTime",
      "endTime",
      "timezone",
      "location",
      "registrationUrl",
      "missingFields",
    ]) {
      if (!event[field]) {
        const answer = await rl.question(`${field} (optional): `);

        if (answer) {
          event[field] = answer;
        }
      }
    }

    if (!event.body && !event.bodyFile) {
      const answer = await rl.question("body markdown (optional): ");

      if (answer) {
        event.body = answer;
      }
    }
  } finally {
    rl.close();
  }

  return event;
}

async function readBodyMarkdown(root, event, fallbackTitle) {
  if (event.bodyFile) {
    return normalizeBodyMarkdown(
      await fs.readFile(path.resolve(root, event.bodyFile), "utf8"),
    );
  }

  if (event.body) {
    return normalizeBodyMarkdown(event.body);
  }

  return `Details for ${fallbackTitle} are forthcoming.`;
}

function normalizeTextField(value) {
  return String(value).replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeBodyMarkdown(value) {
  return String(value)
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n+/g, " ").replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (Array.isArray(entry)) {
        return entry.length > 0;
      }

      return entry !== undefined && entry !== "";
    }),
  );
}

export async function intakeEvent(root, options) {
  const event = options.yes ? options : await promptForMissingFields(options);

  assertRequiredFields(event);

  const slug = event.slug ? slugify(event.slug) : slugify(event.title);

  if (!slug) {
    throw new Error("A slug could not be generated. Provide --slug explicitly.");
  }

  const eventsDirectory = path.join(root, "content", "events");
  const eventDirectory = path.join(eventsDirectory, slug);
  const manifestPath = path.join(eventDirectory, "event.json");
  const bodyFilename = event.markdown || "body.md";
  const bodyMarkdown = await readBodyMarkdown(root, event, event.title);
  const exists = await pathExists(eventDirectory);

  if (exists && !options.update) {
    throw new Error(
      `Event "${slug}" already exists. Re-run with --update to replace it.`,
    );
  }

  const missingFields = splitList(event.missingFields);
  const source = compactObject({
    kind: event.sourceKind || "manual",
    note: event.sourceNote,
  });
  const nextEvent = compactObject({
    type: "event",
    status: event.status || "draft",
    slug,
    title: normalizeTextField(event.title),
    date: normalizeTextField(event.date),
    startTime: event.startTime && normalizeTextField(event.startTime),
    endTime: event.endTime && normalizeTextField(event.endTime),
    timezone: event.timezone && normalizeTextField(event.timezone),
    location: event.location && normalizeTextField(event.location),
    summary: normalizeTextField(event.summary),
    body: bodyFilename,
    registrationUrl:
      event.registrationUrl && normalizeTextField(event.registrationUrl),
    missingFields,
    source,
  });

  if (options.dryRun) {
    console.log(JSON.stringify(nextEvent, null, 2));
    return { slug, eventDirectory };
  }

  await fs.mkdir(eventDirectory, { recursive: true });
  await fs.writeFile(
    path.join(eventDirectory, bodyFilename),
    `${bodyMarkdown.trim()}\n`,
    "utf8",
  );
  await writeJsonFile(manifestPath, nextEvent);

  const findings = await validateEvents(root);

  if (findings.some((result) => result.level === "error")) {
    for (const result of findings) {
      const prefix = result.event ? `[${result.event}] ` : "";
      console.error(`${result.level.toUpperCase()}: ${prefix}${result.message}`);
    }

    throw new Error("Event validation failed after intake.");
  }

  return { slug, eventDirectory };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = args.root ? path.resolve(args.root) : process.cwd();
  const result = await intakeEvent(root, args);
  console.log(`${args.dryRun ? "Dry run" : args.update ? "Updated" : "Added"} ${result.slug}`);
  console.log(path.relative(root, result.eventDirectory));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

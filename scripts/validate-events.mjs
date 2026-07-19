#!/usr/bin/env node

import path from "node:path";
import { pathToFileURL } from "node:url";
import { validateEvents } from "./events-workflow.mjs";

function formatFinding(result) {
  const prefix = result.event ? `[${result.event}] ` : "";
  return `${result.level.toUpperCase()}: ${prefix}${result.message}`;
}

export async function main() {
  const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  const findings = await validateEvents(root);
  const errors = findings.filter((result) => result.level === "error");

  if (!findings.length) {
    console.log("Event validation passed.");
    return;
  }

  for (const result of findings) {
    console.log(formatFinding(result));
  }

  if (errors.length) {
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}

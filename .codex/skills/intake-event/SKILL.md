---
name: intake-event
description: Add or update Apocalypse Anonymous upcoming events using the repo's JSON index plus Markdown body workflow. Use when the user asks to add, intake, schedule, draft, update, or normalize an upcoming event for the site, especially when event details are supplied in chat, notes, email-like text, or a rough brief.
---

# Intake Event

## Overview

Use this skill to turn rough event details into the Artkive-inspired content files consumed by `/upcoming-events`.

## Workflow

1. Inspect `content/events/README.md` and existing `content/events/<slug>/event.json` manifests for the current schema and slugs.
2. Extract or ask for the required fields: `title`, `date` in `YYYY-MM-DD`, and `summary`.
3. Set `"status": "draft"` by default. Change to `"published"` only when the user clearly approves the event for the public site.
4. Preserve longer prose as Markdown body content. If the user provides paragraphs, links, accessibility notes, or preparation details, put them in `body.md` rather than overloading JSON.
5. Run the repo script from the project root:

```bash
npm run intake:event -- --title "Event title" --date 2026-08-01 --summary "Short summary" --location "Zoom" --body "Markdown body"
```

Use `--body-file path/to/file.md` when body copy is already in a file. Use `--update` only when intentionally replacing an existing event with the same slug. Use `--dry-run` to inspect the generated JSON without writing files. Use `npm run validate:events` after manual edits.

## Content Rules

- Keep JSON concise and structured in `content/events/<slug>/event.json`.
- Keep prose, links, and contextual details in the Markdown body.
- Let the script generate the slug unless the user provides a specific one.
- Keep event dates as real calendar dates, not relative phrases.
- Use `HH:mm` 24-hour times in JSON, matching the OurLex501 event schema.
- Match the existing understated site voice.
- Run `npm.cmd run lint` after edits when feasible.

## Artkive Reference

This workflow mirrors Artkive's per-item folder pattern: a small JSON manifest plus prose sidecar files, with scripts performing writes and validation. It also borrows OurLex501's status rule: drafts stay in the repo, and only published items appear publicly.

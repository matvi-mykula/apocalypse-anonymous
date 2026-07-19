# Upcoming Events Content

Events follow the Artkive-style folder pattern: each event gets a folder with a JSON manifest and Markdown sidecar body.

```text
content/events/
  example-event/
    event.json
    body.md
```

Only events with `"status": "published"` appear on `/upcoming-events`.

You can also run `npm run intake:event` for an interactive event intake, or pass fields directly:

```bash
npm run intake:event -- --title "Event title" --date 2026-08-01 --summary "Short summary" --location "Zoom" --body "Longer Markdown body"
```

Required fields:

- `slug`: unique URL-safe identifier
- `type`: `"event"`
- `status`: `"draft"`, `"published"`, or `"archived"`
- `title`: event title
- `date`: `YYYY-MM-DD`
- `summary`: short description
- `body`: Markdown filename in this event folder

Optional fields:

- `startTime`
- `endTime`
- `timezone`
- `location`
- `registrationUrl`
- `missingFields`
- `source`

Published events with dates before today are automatically hidden from `/upcoming-events`.

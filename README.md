# JustSearch Employee Work Tracker

A small Next.js + Tailwind CSS + shadcn/ui front-end that posts work log entries
to an n8n webhook, which then writes the data to Google Sheets.

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn
```

2. Configure your n8n webhook URL in a `.env.local` file:

```bash
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://shon555.app.n8n.cloud/webhook-test/e0cb3c43-2a2b-4f05-a8e4-1036baa42dab
```

3. Run the dev server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser.

Every submission POSTs JSON to the configured n8n webhook. Use an n8n workflow
to receive the data and append rows into Google Sheets.

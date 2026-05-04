# Meme of the Day Creator Economy

A Next.js app for creating and sharing daily memes in a creator-economy style experience.

## Installation

1. Make sure you have Node.js 18+ installed.
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Then fill in your values in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

You can find both in your Supabase dashboard under **Project Settings → API**.

> Also create a public Storage bucket named `meme-images` in your Supabase project for image uploads.

## Run the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For a production run:

```bash
npm run build
npm run start
```

## Development Pipeline

This app is developed using a dual-AI pipeline:
- Claude Code for architecture generation
- Cursor AI for iterative refinement


![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)
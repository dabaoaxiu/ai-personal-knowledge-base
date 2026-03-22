# AI Personal Knowledge Base

A complete web app built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, and the OpenAI API.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI API
- Vercel-ready project structure

## Project Structure

```text
.
|-- app
|   |-- api
|   |   |-- chat
|   |   |   `-- route.ts
|   |   `-- notes
|   |       `-- route.ts
|   |-- assistant
|   |   `-- page.tsx
|   |-- library
|   |   |-- [id]
|   |   |   `-- page.tsx
|   |   `-- page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components
|   |-- app-shell.tsx
|   |-- chat-panel.tsx
|   |-- dashboard-composer.tsx
|   |-- empty-state.tsx
|   |-- library-controls.tsx
|   |-- nav-link.tsx
|   |-- note-card.tsx
|   `-- tag-chip.tsx
|-- lib
|   |-- env.ts
|   |-- notes.ts
|   |-- openai.ts
|   |-- supabase.ts
|   `-- utils.ts
|-- supabase
|   `-- schema.sql
|-- types
|   `-- index.ts
|-- .env.example
|-- .eslintrc.json
|-- .gitignore
|-- next.config.mjs
|-- package.json
|-- postcss.config.mjs
|-- tailwind.config.ts
`-- tsconfig.json
```

## Features

### 1. Dashboard

- Input or paste any knowledge content
- Save notes with one click
- View recently added notes

### 2. Library

- Browse all knowledge cards
- Search by keyword
- Filter by tag

### 3. Note Detail

- View full content
- View AI-generated summary
- View tags

### 4. AI Assistant

- Chat interface
- Questions answered from existing notes

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

## Supabase Setup

Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor.

## Local Development

```bash
npm install
npm run dev
```

## API Routes

- `POST /api/notes` - save a note and generate AI summary/tags
- `GET /api/notes` - fetch notes
- `POST /api/chat` - grounded Q&A on top of the knowledge base

## Deployment

Deploy directly to Vercel:

1. Import this project into Vercel.
2. Add the same environment variables from `.env.local`.
3. Deploy.

## Notes

- If OpenAI is not configured, note saving still works with fallback summary and tags.
- Chat requires both Supabase and OpenAI.

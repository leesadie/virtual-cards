# Virtual thank you cards

![img](/public/example.png)

## About

This is a very rough prototype for the purpose of sending collaborative thank you cards to the guest speakers of the COGS 401 course (in which I am a teaching assistant), where each student can sign their name and optionally add a message to each speaker. 

**Features**

The following have been implemented:
- Shareable links for signing and viewing
- Group signing with duplicate name prevention 
- Grid of signatures on card back that extends dynamically
- Configurable per-card recipient name and message
- Simple export by print to PDf via native window dialog
- Simple front/back card flip animation and envelope open interaction

**Limitations**

The following are obviously non-ideal, and would need to be fixed were this app to be used beyond this course:
- Card covers are just being uploaded as SVGs and recipient names added manually to the database. A dedicated admin page to upload cards would probably be a more robust, long-term approach.
- Students currently can't edit their messages after submitting the sign form.
- No authentication - in principle anyone can access each sign page and card page if card IDs are known (a clear security violation).

**Stack**

This project uses [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/) with [Tailwind CSS](https://tailwindcss.com/), is written in TypeScript, and is deployed with [Vercel](https://vercel.com/).

## Database schema

**Cards table**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key, auto-generated |
| recipient_name | text | No | - | Display name shown in app UI |
| message | text | No | - | Message to recipient |
| front_image_url | text | No | - | Public URL to card cover, from supabase card-images storage bucket |
| created_at | TIMESTAMP | No | CURRENT_TIMESTAMP | Card creation time |

**Signatures table**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key, auto-generated |
| card_id | UUID | No | - | References `id` from cards table |
| name | text | No | - | Name to sign card |
| personal_message | text | Yes | - | Optional message, shown with name in app UI |
| created_at | TIMESTAMP | No | CURRENT_TIMESTAMP | Sign form submission time |

## Usage

**Viewing and signing**

Students can sign a given card with the base URL (https://virtual-card.vercel.app) and `/sign/[cardId]`. Recipients can view their signed card with the base URL and `/card/[cardId]`.

**Running locally**
```bash
npm install
npm run dev
```

**Environment variables**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase API URL found on Project Overview page, in Project Settings/Data API, or in Integrations/Data API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase publishable key found in Project Settings/API Keys

## Contributing

Contributions are welcome! See [Contributing](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) for more. COGS 401 students interested in contributing should fork the repo and send a pull request.
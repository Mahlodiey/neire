# Database

NEIRE uses PostgreSQL with Prisma ORM.

## Setup

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Set `DATABASE_URL` in `.env.local` to your PostgreSQL connection string.

3. Install dependencies and generate the Prisma client:

```bash
npm install
npm run db:generate
```

4. Create the development database tables:

```bash
npm run db:migrate -- --name init
```

Use `npm run db:studio` to inspect data locally.

## Schema overview

- `users`: accounts and learner identity
- `study_materials` and `document_chunks`: uploaded content and extracted text
- `topics` and `concepts`: AI-generated content structure
- `learning_paths` and `learning_path_items`: personalized sequence of activities
- `tutor_sessions` and `tutor_messages`: interactive tutoring history
- `questions` and `answer_attempts`: practice and assessment
- `topic_mastery`: per-student understanding, confidence, and retention signals
- `review_schedules`: spaced-repetition review queue

The schema intentionally stores embeddings outside the first migration. Add a vector provider later when retrieval requirements are clear; document content remains available through `document_chunks` for the MVP.

# PostgreSQL Setup Guide

## Option 1: Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Start PostgreSQL

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL 16 container named `neire-postgres`
- Create a database named `neire`
- Set credentials: `neire_user` / `neire_password`
- Expose port `5432`
- Store data in a named volume for persistence

### Verify it's running

```bash
docker-compose ps
```

You should see the `neire-postgres` container as `Up`.

### Stop PostgreSQL

```bash
docker-compose down
```

### Stop and delete all data

```bash
docker-compose down -v
```

---

## Option 2: Manual Local Installation

### macOS (via Homebrew)

```bash
brew install postgresql@16
brew services start postgresql@16
```

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Windows

Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Create Database and User

```bash
psql -U postgres
```

Then run:

```sql
CREATE USER neire_user WITH PASSWORD 'neire_password';
CREATE DATABASE neire OWNER neire_user;
ALTER ROLE neire_user SET client_encoding TO 'utf8';
ALTER ROLE neire_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE neire_user SET default_transaction_deferrable TO on;
ALTER ROLE neire_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE neire TO neire_user;
\q
```

---

## Configure Environment

1. Copy the env template:

```bash
cp .env.example .env.local
```

2. Update `.env.local` with your database URL:

**For Docker:**
```
DATABASE_URL="postgresql://neire_user:neire_password@localhost:5432/neire"
```

**For local PostgreSQL (macOS/Linux):**
```
DATABASE_URL="postgresql://neire_user:neire_password@localhost:5432/neire"
```

**For Windows:**
```
DATABASE_URL="postgresql://neire_user:neire_password@localhost:5432/neire"
```

3. Add JWT secret:

```
JWT_SECRET="your-super-secret-key-change-this-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

---

## Initialize Database

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

```bash
npx prisma generate
```

### 3. Run migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Set up indexes and relationships
- Generate the Prisma client

### 4. (Optional) Browse database

```bash
npx prisma studio
```

Opens a GUI at `http://localhost:5555` to browse and manage data.

---

## Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Troubleshooting

### Connection refused on localhost:5432

**Docker:**
```bash
docker-compose ps  # Check if container is running
docker-compose logs postgres  # View logs
```

**Local PostgreSQL:**
```bash
# macOS
brew services list

# Linux
sudo service postgresql status

# Windows
# Check Services app or Task Manager
```

### Database already exists

```bash
# Drop and recreate (removes all data)
docker-compose down -v
docker-compose up -d
```

### Wrong password

Update `DATABASE_URL` in `.env.local` and ensure it matches your credentials.

### Prisma migrations failed

```bash
# Reset database (careful: deletes all data)
npx prisma migrate reset
```

---

## Next Steps

1. Once the database is running and migrations are complete, test the app:
   ```bash
   npm run dev
   ```

2. Sign up at `/auth/signup`
3. Upload a study material
4. Check that it appears in your dashboard


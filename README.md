# NEIRE - Adaptive AI Learning Platform

**NEIRE** is an innovative, adaptive AI learning platform designed to function as a personal tutor rather than just a study app. It transforms raw study materials into structured, interactive learning journeys tailored to each student's unique needs.

## 🎯 Core Concept

Students upload study materials (PDFs, notes, textbooks, etc.), and NEIRE:

1. **Analyzes** the content and structures it into coherent topics
2. **Explains** concepts using voice, text, visuals, examples, stories, and conversations
3. **Practices** with adaptive questions based on student understanding
4. **Tracks** performance, mastery, confidence, and retention
5. **Adapts** the learning path in real-time based on individual progress
6. **Reviews** with spaced repetition and personalized recommendations

## 🚀 Features

- **Smart Content Analysis**: Automatically extract and structure study materials
- **Multi-Modal Teaching**: Explanations via text, voice, visuals, examples, and interactive conversations
- **Adaptive Intelligence**: Real-time tracking of understanding, mistakes, confidence, and performance
- **Practice & Assessment**: Interactive questions with detailed feedback and explanations
- **Progress Tracking**: Monitor mastery by topic and identify weak areas
- **Spaced Repetition**: Automated recall questions for better long-term retention
- **Personalized Learning Path**: Intelligent sequencing of explanations, practice, recall, and review

## 📋 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management
- **Axios** - HTTP client

### Backend
- **Next.js API Routes** - Serverless backend
- **Node.js** - Runtime
- **Prisma ORM** - Database ORM with migrations

### Database
- **PostgreSQL 16** - Primary database
- **Docker** - Local development (optional)

### Authentication
- **JWT (JSON Web Tokens)** - Session management
- **bcrypt** - Password hashing

### Infrastructure (Future)
- **Vercel** - Frontend deployment
- **AWS S3** - Document storage
- **AWS RDS** - Managed PostgreSQL

## 🏗️ Project Structure

```
neire/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── auth/               # Authentication pages
│   │   │   ├── signup/
│   │   │   └── login/
│   │   ├── dashboard/          # Main dashboard
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   ├── materials/
│   │   │   └── users/
│   │   └── learn/              # Learning interface (future)
│   ├── components/             # Reusable React components
│   │   ├── UploadForm.tsx
│   │   └── MaterialList.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useMaterials.ts
│   │   └── useUploadMaterial.ts
│   ├── lib/                    # Utilities and helpers
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── errors.ts
│   │   ├── file-utils.ts
│   │   └── s3.ts
│   └── types/                  # TypeScript types
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── docs/                       # Documentation
│   ├── database.md
│   └── postgresql-setup.md
├── public/                     # Static assets
├── docker-compose.yml          # Docker configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
├── tailwind.config.js          # Tailwind config
└── README.md                   # This file
```

## 🚦 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional, for PostgreSQL)
- PostgreSQL 16 (if not using Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mahlodiey/neire.git
   cd neire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL**

   **Option A: Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

   **Option B: Local Installation**
   See [PostgreSQL Setup Guide](docs/postgresql-setup.md)

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local`:
   ```
   DATABASE_URL="postgresql://neire_user:neire_password@localhost:5432/neire"
   JWT_SECRET="your-super-secret-key"
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   ```

5. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### First Steps

1. Sign up at `/auth/signup`
2. Upload a study material (PDF, TXT, or Markdown)
3. View your dashboard and materials
4. Monitor upload and processing status

## 📚 Learning Workflow (MVP)

### Phase 1: Core Upload & Structure ✅
- User uploads a study material (PDF/text)
- System extracts text and chunks content
- Material is stored in database

### Phase 2: Interactive Learning (In Progress)
- Student selects a topic
- NEIRE provides an explanation
- Student can ask for simplifications or examples
- System tracks understanding

### Phase 3: Practice
- Generated questions based on the material
- Student answers and receives feedback
- System logs performance metrics

### Phase 4: Adaptive Review
- System analyzes performance and confidence
- Recommends next action (explanation, practice, recall, review)
- Spaced repetition for weak areas

## 🔧 Development Roadmap

### ✅ Completed
- [x] Database schema design
- [x] Authentication system (JWT + bcrypt)
- [x] File upload API
- [x] Upload UI with drag-and-drop
- [x] Material listing and management
- [x] PostgreSQL setup guide

### 🚧 In Progress
- [ ] AI-powered topic extraction (OpenAI)
- [ ] Question generation
- [ ] Learning path creation

### 📅 Planned
- [ ] Tutor chat interface
- [ ] Multi-modal explanations (text, voice, visuals)
- [ ] Practice question system
- [ ] Performance tracking dashboard
- [ ] Spaced repetition scheduler
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/YourFeature`)
2. Commit your changes (`git commit -m 'Add YourFeature'`)
3. Push to the branch (`git push origin feature/YourFeature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues:

1. Check the [PostgreSQL Setup Guide](docs/postgresql-setup.md)
2. Review the [Database Documentation](docs/database.md)
3. Open a GitHub issue

---

**NEIRE**: Transforming study materials into adaptive learning journeys. 🚀

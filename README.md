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
- **React** - Component library

### Backend
- **Next.js API Routes** - Serverless backend
- **Node.js** - Runtime

### Database
- **PostgreSQL** - Primary database (to be configured)
- **Redis** - Caching layer (optional, for later phases)

### AI & LLM
- **OpenAI API** - Language model for explanations and content generation
- **Embedding API** - Semantic search and vector storage

### Infrastructure
- **Vercel** - Frontend deployment
- **AWS S3 / Similar** - Document storage
- **Managed PostgreSQL** - Database hosting

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
│   │   ├── learn/              # Learning interface
│   │   ├── api/                # API routes (to be created)
│   │   └── admin/              # Admin panel (future)
│   ├── components/             # Reusable components (to be created)
│   ├── lib/                    # Utilities and helpers (to be created)
│   ├── types/                  # TypeScript types (to be created)
│   └── services/               # External service integrations (to be created)
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
├── tailwind.config.js          # Tailwind config
└── README.md                   # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

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

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys and configuration:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   OPENAI_API_KEY=your_key_here
   DATABASE_URL=postgresql://user:password@localhost:5432/neire
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📚 Learning Workflow (MVP)

### Phase 1: Core Upload & Structure
1. User uploads a study material (PDF/text)
2. System extracts text and identifies key topics
3. Content is chunked and structured

### Phase 2: Interactive Learning
1. Student selects a topic
2. NEIRE provides an explanation
3. Student can ask for simplifications or examples
4. System tracks understanding

### Phase 3: Practice
1. Generated questions based on the material
2. Student answers and receives feedback
3. System logs performance metrics

### Phase 4: Adaptive Review
1. System analyzes performance and confidence
2. Recommends next action (more explanation, practice, recall, review)
3. Spaced repetition for weak areas

## 🔧 Development Roadmap

### Week 1-2: Foundation
- [ ] Database schema design
- [ ] Authentication system
- [ ] File upload and storage

### Week 3-4: Content Processing
- [ ] PDF/text extraction
- [ ] Content chunking and structuring
- [ ] Embedding generation

### Week 5-6: Learning Interface
- [ ] Tutor chat interface
- [ ] Question generation and answering
- [ ] Progress tracking dashboard

### Week 7-8: Adaptive Logic
- [ ] Performance analysis
- [ ] Learning path generation
- [ ] Personalized recommendations

### Week 9-10: Polish & Deploy
- [ ] UI/UX refinement
- [ ] Testing and bug fixes
- [ ] Production deployment

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/YourFeature`)
2. Commit your changes (`git commit -m 'Add YourFeature'`)
3. Push to the branch (`git push origin feature/YourFeature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**NEIRE**: Transforming study materials into adaptive learning journeys. 🚀

# IELTS Writing Scorer

An advanced AI-powered web application for scoring IELTS Writing Task 1 & 2 essays with detailed feedback, user authentication, and essay history tracking.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Production](https://img.shields.io/badge/status-live-success)](https://vercel.com)

## ✨ Features

- 🎯 **Accurate Band Scoring** - Professional IELTS band scores (0.0-9.0) for all four criteria
- 🤖 **AI-Powered Analysis** - Uses Groq's free LLaMA 3.3 70B model for accurate scoring
- 📊 **Detailed Feedback** - Comprehensive criterion-by-criterion analysis
- 🔍 **Issue Highlighting** - Identifies specific grammar, vocabulary, and cohesion problems
- 📝 **Personalized Revision Plan** - Actionable steps to improve your score
- 🔐 **Secure Authentication** - User accounts with NextAuth.js v5
- 📚 **Essay History** - Track all your submissions and progress over time
- 👤 **User Profiles** - Manage your account and view statistics
- 💾 **Database Persistence** - All essays and results saved securely
- 🚀 **Modern UI** - Responsive design with Tailwind CSS
- ⚡ **Fast & Free** - Uses free Groq API (no OpenAI costs)

## 🏗️ Architecture

```
writing/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── essays/       # Essay CRUD operations
│   │   ├── score/        # Scoring endpoint
│   │   └── user/         # User management
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── essay/           # Essay view pages
│   └── profile/         # User profile
├── components/           # React components
├── lib/                 # Core library
│   ├── config/         # Configuration & constants
│   ├── prompts/        # AI prompts (system & user)
│   ├── schema/         # Zod validation schemas
│   ├── services/       # Business logic (scoring service)
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
└── prisma/             # Database schema & migrations
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.3
- **UI Components**: React 18

### Backend
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js v5
- **Database**: Prisma ORM + SQLite (production: PostgreSQL/MySQL)
- **Security**: bcryptjs for password hashing

### AI & Validation
- **AI Provider**: Groq (FREE)
- **Model**: LLaMA 3.3 70B Versatile
- **Validation**: Zod schema validation
- **Scoring**: Custom IELTS-aligned algorithm

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Groq API key (free from [console.groq.com](https://console.groq.com/))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd writing
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your values:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. **Set up the database**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### For New Users

1. **Sign Up** - Create your account at `/auth/signup`
2. **Sign In** - Log in with your credentials
3. **Submit Essay** - Go to dashboard and submit your first essay
4. **View Results** - Get detailed band scores and feedback

### Submitting an Essay

1. Select **Task Type** (Task 1 or Task 2)
2. Select **Module** (Academic or General Training)
3. Enter the **essay prompt**
4. Paste or type your **essay** (minimum 150 words for Task 1, 250 for Task 2)
5. Click **"Score Essay"** and wait 10-30 seconds
6. View your **band scores and detailed feedback**

### Managing Your Essays

- **Dashboard** (`/dashboard`): View all submitted essays with scores
- **Essay Details** (`/essay/[id]`): See detailed feedback for each essay
- **Profile** (`/profile`): Update your account information

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new account | No |
| POST | `/api/auth/[...nextauth]` | Sign in/out (NextAuth) | No |

### Essay Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/score` | Submit essay for scoring | Yes |
| GET | `/api/essays` | Get all user essays | Yes |
| GET | `/api/essays/[id]` | Get specific essay | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/api/user/update` | Update user profile | Yes |

## 🎯 Scoring System

### IELTS Criteria (All Weighted Equally at 25%)

1. **Task Achievement/Response**
   - How well the essay addresses all parts of the task
   - Clarity and consistency of position (Task 2)
   - Coverage of key features (Task 1)

2. **Coherence and Cohesion**
   - Logical organization and paragraph structure
   - Use of cohesive devices
   - Progression of ideas

3. **Lexical Resource**
   - Vocabulary range and sophistication
   - Accuracy of word choice
   - Use of collocations and less common words

4. **Grammatical Range and Accuracy**
   - Variety of sentence structures
   - Grammatical accuracy
   - Error frequency and impact

### Band Score Calculation

- Each criterion scored independently (0.0-9.0)
- Overall band = arithmetic mean of 4 criteria
- Rounded to nearest 0.5 using official IELTS rounding:
  - 0.00-0.24 → 0.0
  - 0.25-0.74 → 0.5
  - 0.75-0.99 → next whole band

### Error Tolerance (per 300 words)

| Band | Error Count | Quality Level |
|------|-------------|---------------|
| 9.0 | 0-2 minor slips | Near perfect |
| 8.0 | 4-6 errors | Very good |
| 7.0 | 8-12 errors | Good |
| 6.0 | 15-20 errors | Competent |
| 5.0 | 25-35 errors | Modest |
| 4.0 | 45-60 errors | Limited |

## 🗄️ Database Schema

### Core Models

**User**
- Authentication and profile information
- One-to-many relationship with Essays

**Essay**
- Task metadata (type, module, prompt)
- Essay content and word count
- Submission timestamp
- One-to-one relationship with Result

**Result**
- Band scores for all criteria
- Executive summary and detailed feedback
- Highlighted issues and revision plan
- Educator notes

**Account & Session**
- NextAuth.js models for authentication

## 🚢 Production Deployment

### Recommended Platforms

- **Vercel** (Recommended for Next.js)
- **Railway** (Includes PostgreSQL)
- **Render**
- **DigitalOcean App Platform**

### Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Switch from SQLite to PostgreSQL/MySQL
- [ ] Run database migrations
- [ ] Configure Groq API key
- [ ] Test authentication flow
- [ ] Test essay scoring endpoint

### Database for Production

**Switch to PostgreSQL:**

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

3. Run migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (12 rounds)
- ✅ JWT-based sessions with NextAuth.js v5
- ✅ Protected API routes with middleware
- ✅ SQL injection prevention via Prisma ORM
- ✅ CSRF protection (built into Next.js)
- ✅ Environment variable validation
- ✅ Input sanitization and validation with Zod

## 🧪 Testing Your Setup

### Manual Testing Steps

1. **Authentication**
   - Create account → Sign in → Sign out
   - Verify protected routes redirect to login

2. **Essay Submission**
   - Submit Task 1 Academic essay
   - Submit Task 2 General essay
   - Verify scoring completes in < 60 seconds

3. **Dashboard**
   - View essay list
   - Click on essay to see details
   - Verify all feedback sections load

4. **Profile**
   - Update name/email
   - Verify changes persist

## 📊 Performance

- **Scoring Time**: 10-30 seconds per essay
- **API Cost**: $0 (Groq is free)
- **Database**: Lightweight SQLite for development, PostgreSQL for production
- **Concurrent Users**: Scales with Next.js/Vercel infrastructure

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support & Troubleshooting

### Common Issues

**"No response from AI model"**
- Check your `GROQ_API_KEY` is valid
- Verify you have Groq API credits
- Check network connectivity

**"Authentication required"**
- Ensure you're logged in
- Check `NEXTAUTH_SECRET` is set
- Clear cookies and sign in again

**Database errors**
- Run `npx prisma generate`
- Run `npx prisma migrate dev`
- Check `DATABASE_URL` is correct

### Getting Help

- Check existing issues on GitHub
- Review the [Setup Guide](SETUP.md)
- Contact: [your-email]

## 🎓 IELTS Resources

- [Official IELTS Writing Band Descriptors](https://www.ielts.org/for-researchers/test-statistics/test-taker-performance)
- [IELTS Academic Writing Task 1](https://www.ielts.org/for-test-takers/test-format/academic/writing)
- [IELTS General Writing Task 1](https://www.ielts.org/for-test-takers/test-format/general-training/writing)

---

**Built with ❤️ for IELTS learners worldwide**
- ✅ Middleware for route protection
- ✅ Input validation and sanitization

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Create new migration
```

## License

MIT

## Support

For issues or questions, please open an issue on the project repository.

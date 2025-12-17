# Project Structure Documentation

## Directory Overview

```
writing/
├── .vscode/                    # VSCode configuration
│   ├── extensions.json        # Recommended extensions
│   └── settings.json          # Editor settings
│
├── app/                       # Next.js App Router
│   ├── api/                   # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   │   ├── [...nextauth]/ # NextAuth handler
│   │   │   └── signup/       # User registration
│   │   ├── essays/           # Essay management
│   │   │   ├── route.ts      # List essays
│   │   │   └── [id]/         # Individual essay
│   │   ├── score/            # Essay scoring
│   │   └── user/             # User management
│   │       └── update/       # Profile updates
│   │
│   ├── auth/                  # Auth pages
│   │   ├── login/            # Login page
│   │   └── signup/           # Signup page
│   │
│   ├── dashboard/             # Dashboard page
│   ├── essay/                 # Essay detail pages
│   │   └── [id]/             # Dynamic essay page
│   ├── profile/               # User profile page
│   │
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
│
├── components/                # React components
│   ├── EssayForm.tsx         # Essay submission form
│   └── ScoringResults.tsx    # Results display
│
├── lib/                       # Core library
│   ├── config/               # Configuration
│   │   └── constants.ts      # App constants
│   │
│   ├── prompts/              # AI prompts
│   │   ├── system-prompt.ts  # System instructions
│   │   └── user-prompt.ts    # User prompt template
│   │
│   ├── schema/               # Validation schemas
│   │   └── scoring-schema.ts # Zod schema for AI response
│   │
│   ├── services/             # Business logic
│   │   └── scoring-service.ts # Essay scoring service
│   │
│   ├── types/                # TypeScript types
│   │   └── index.ts          # Shared type definitions
│   │
│   ├── utils/                # Utility functions
│   │   └── scoring-utils.ts  # Helper functions
│   │
│   └── prisma.ts             # Prisma client instance
│
├── prisma/                    # Database
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration files
│
├── .env.example               # Environment template
├── .env.local                 # Local environment (gitignored)
├── .gitignore                 # Git ignore rules
├── auth.ts                    # NextAuth configuration
├── middleware.ts              # Next.js middleware (auth)
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── README.md                  # Main documentation
└── SETUP.md                   # Setup instructions
```

## Key Files Explained

### Configuration Files

- **`next.config.js`** - Next.js build and runtime configuration
- **`tsconfig.json`** - TypeScript compiler options
- **`tailwind.config.js`** - Tailwind CSS customization
- **`postcss.config.js`** - PostCSS plugins (Tailwind)

### Authentication

- **`auth.ts`** - NextAuth.js configuration with Credentials provider
- **`middleware.ts`** - Route protection and auth redirects
- **`app/api/auth/[...nextauth]/route.ts`** - NextAuth API handler
- **`app/api/auth/signup/route.ts`** - User registration endpoint

### Scoring System

- **`lib/services/scoring-service.ts`** - Main scoring logic
- **`lib/prompts/system-prompt.ts`** - AI system instructions with IELTS criteria
- **`lib/prompts/user-prompt.ts`** - Dynamic user prompt builder
- **`lib/schema/scoring-schema.ts`** - Zod validation for AI responses
- **`lib/utils/scoring-utils.ts`** - Helper functions (word count, validation)

### Database

- **`prisma/schema.prisma`** - Database models and relations
- **`lib/prisma.ts`** - Singleton Prisma client
- **`prisma/migrations/`** - Version-controlled schema changes

### Types & Constants

- **`lib/types/index.ts`** - Centralized TypeScript type definitions
- **`lib/config/constants.ts`** - App-wide constants and configuration

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `EssayForm.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Utilities**: kebab-case (e.g., `scoring-utils.ts`)
- **Types**: lowercase (e.g., `index.ts` in types/)

### Code

- **Components**: PascalCase (e.g., `EssayForm`)
- **Functions**: camelCase (e.g., `scoreEssay`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ROUTES`)
- **Types/Interfaces**: PascalCase (e.g., `ScoreEssayRequest`)

## Import Paths

Use the `@/` alias for absolute imports:

```typescript
import { scoreEssay } from "@/lib/services/scoring-service";
import { IELTS_CONFIG } from "@/lib/config/constants";
import type { ScoreEssayRequest } from "@/lib/types";
```

## Adding New Features

### New API Route

1. Create route in `app/api/your-route/route.ts`
2. Add types to `lib/types/index.ts`
3. Add constants to `lib/config/constants.ts`
4. Implement business logic in `lib/services/`

### New Page

1. Create page in `app/your-page/page.tsx`
2. Add route constant to `lib/config/constants.ts`
3. Update middleware if authentication required

### New Component

1. Create component in `components/YourComponent.tsx`
2. Add prop types to `lib/types/index.ts` if reusable
3. Import and use in pages

## Environment Variables

See `.env.example` for all required variables:

- `GROQ_API_KEY` - AI model access
- `DATABASE_URL` - Database connection
- `NEXTAUTH_SECRET` - Session encryption
- `NEXTAUTH_URL` - Base URL

## Best Practices

1. **Always use TypeScript** - No plain JavaScript
2. **Centralize types** - Add to `lib/types/index.ts`
3. **Centralize constants** - Add to `lib/config/constants.ts`
4. **Use Zod for validation** - All API inputs should be validated
5. **Handle errors properly** - Return typed responses with success/error
6. **Comment complex logic** - Use JSDoc for functions
7. **Keep components small** - Extract logic to hooks/services
8. **Use Prisma for database** - Never write raw SQL

## Testing

### Manual Testing

1. Test authentication flow
2. Test essay submission
3. Test scoring accuracy
4. Test dashboard and history
5. Test error handling

### Build Testing

```bash
npm run build
```

Ensure no TypeScript or build errors before deployment.

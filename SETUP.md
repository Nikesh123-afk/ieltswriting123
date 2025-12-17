# IELTS Writing Scorer - Setup Guide

## Quick Start

Follow these steps to get your IELTS Writing Scorer app running:

### 1. Install Dependencies

Open a terminal in the project directory and run:

```powershell
npm install
```

### 2. Configure OpenAI API Key

1. Copy the example environment file:
```powershell
Copy-Item .env.local.example .env.local
```

2. Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

**Get your API key from:** https://platform.openai.com/api-keys

### 3. Run the Development Server

```powershell
npm run dev
```

The app will be available at: http://localhost:3000

### 4. Test the App

1. Open http://localhost:3000 in your browser
2. Select Task Type (Task 1 or Task 2)
3. Select Module (Academic or General Training)
4. Click "Load Sample" to load a sample prompt, or enter your own
5. Paste an essay (minimum 150 words for Task 1, 250 for Task 2)
6. Click "Score Essay" and wait 30-60 seconds for results

## Features

✅ **Accurate Scoring**: Band scores (0.0-9.0) for all four IELTS criteria
✅ **Detailed Feedback**: Comprehensive comments for each criterion
✅ **Error Highlighting**: Specific examples of grammar, vocabulary, and cohesion issues
✅ **Revision Plan**: Prioritized action items for improvement
✅ **Modern UI**: Responsive design with dark mode support

## Project Structure

```
writing/
├── app/
│   ├── api/
│   │   └── score/
│   │       └── route.ts          # API endpoint for scoring
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page
├── components/
│   ├── EssayForm.tsx              # Essay submission form
│   └── ScoringResults.tsx         # Results display
├── lib/
│   ├── prompts/
│   │   ├── system-prompt.ts       # System prompt for AI
│   │   └── user-prompt.ts         # User prompt template
│   ├── schema/
│   │   └── scoring-schema.ts      # Zod validation schemas
│   ├── services/
│   │   └── scoring-service.ts     # Main scoring logic
│   └── utils/
│       └── scoring-utils.ts       # Helper utilities
├── package.json
├── tsconfig.json
└── README.md
```

## API Usage

You can also use the scoring API directly:

**Endpoint:** `POST /api/score`

**Request Body:**
```json
{
  "taskType": "task2",
  "module": "academic",
  "promptText": "Some people think...",
  "essayText": "Your essay text here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meta": { ... },
    "scores": { ... },
    "feedback": { ... }
  },
  "warnings": []
}
```

## Customization

### Change AI Model

Edit `.env.local`:
```
OPENAI_MODEL=gpt-4                 # Use GPT-4
OPENAI_MODEL=gpt-4-turbo-preview   # Use GPT-4 Turbo (recommended)
```

### Adjust Scoring Prompts

Edit files in `lib/prompts/` to customize scoring behavior:
- `system-prompt.ts`: Overall examiner instructions
- `user-prompt.ts`: Task-specific scoring guidelines

### Modify UI

- `app/page.tsx`: Main page layout
- `components/EssayForm.tsx`: Form fields and validation
- `components/ScoringResults.tsx`: Results display
- `app/globals.css`: Global styles (uses Tailwind CSS)

## Troubleshooting

### "OpenAI API key not configured"
- Make sure `.env.local` exists and contains `OPENAI_API_KEY=sk-...`
- Restart the dev server after adding the key

### "Essay does not appear to be in English"
- Make sure the essay contains primarily English text
- Check that the essay isn't too short

### Scoring takes too long
- Normal scoring takes 30-60 seconds
- Check your internet connection
- Verify OpenAI API status: https://status.openai.com/

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and restart: `Remove-Item -Recurse .next; npm run dev`

## Production Deployment

### Build for Production

```powershell
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel: https://vercel.com/new
3. Add `OPENAI_API_KEY` in Vercel environment variables
4. Deploy!

### Deploy to Other Platforms

- **Netlify**: Supports Next.js with adapter
- **AWS/Azure**: Use Docker or serverless deployment
- **Railway/Render**: Direct deployment from Git

## Cost Estimation

Using GPT-4 Turbo:
- ~2,000-4,000 tokens per essay scoring
- Input: ~$0.01 per 1K tokens
- Output: ~$0.03 per 1K tokens
- **Estimated cost per essay: $0.10-0.20**

## Next Steps

🎯 **Improve Accuracy:**
- Collect human-scored essays for calibration
- Build a calibration layer (see README.md for algorithm details)
- Add feature extraction for hybrid scoring

📊 **Add Features:**
- User authentication
- Essay history and progress tracking
- Comparison with previous attempts
- Export results as PDF
- Teacher dashboard

🚀 **Scale:**
- Add caching for common tasks
- Rate limiting
- Database integration (PostgreSQL/MongoDB)
- Batch scoring

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the main [README.md](README.md) for algorithm details
- OpenAI API docs: https://platform.openai.com/docs

## License

MIT License - feel free to use and modify for your needs!

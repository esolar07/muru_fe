# Muru Frontend

A modern, responsive web application for the Muru Herbal Matchmaker built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3001` (or configure `NEXT_PUBLIC_API_URL`)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
muru_fe/
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── quiz/             # Quiz-specific components
│   │   ├── layout/           # Layout components
│   │   └── results/          # Results/recommendation components
│   ├── lib/
│   │   ├── api/              # API client functions
│   │   │   └── client.ts     # API client with typed methods
│   │   ├── types/            # TypeScript type definitions
│   │   │   └── index.ts      # Shared types
│   │   └── utils.ts          # Utility functions
│   └── hooks/                # Custom React hooks
├── public/                   # Static assets
└── .env.local                # Environment variables
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Available Components

The following shadcn/ui components are installed and ready to use:

- Button
- Card (with CardHeader, CardTitle, CardDescription, CardContent)
- Input
- Label
- Form
- Select
- Radio Group
- Checkbox

## API Client

The API client is located at `src/lib/api/client.ts` and provides typed methods for:

- `getCategories()` - Fetch all symptom categories
- `getSymptoms(categoryIds?)` - Fetch symptoms, optionally filtered by category
- `submitSymptoms(data)` - Submit selected symptoms and create/update quiz session
- `getSession(sessionId)` - Retrieve a quiz session with selected symptoms

Example usage:

```typescript
import { apiClient } from '@/lib/api/client';

// Get all categories
const response = await apiClient.getCategories();

// Submit symptoms
const result = await apiClient.submitSymptoms({
  symptoms: [
    {
      categoryId: 1,
      selectedHighSymptoms: ['symptom1', 'symptom2'],
      selectedLowSymptoms: ['symptom3']
    }
  ]
});
```

## Type Definitions

All TypeScript types are defined in `src/lib/types/index.ts` including:

- API response types
- Category and symptom types
- Quiz session types
- Request/response payloads

## Design System

The application uses Tailwind CSS v4 with a custom design system defined in `globals.css`:

- Color tokens (primary, secondary, accent, muted, etc.)
- Dark mode support
- Consistent spacing and typography
- shadcn/ui component theming

## Next Steps

1. Implement quiz flow components
2. Create symptom selection interface
3. Build results/recommendation display
4. Add state management (React Context or Zustand)
5. Implement routing for multi-step quiz

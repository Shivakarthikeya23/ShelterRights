# ShelterRights - Housing Affordability & Advocacy Platform

A comprehensive platform helping renters and homebuyers navigate the housing crisis through affordability calculators, tenant rights assistance, property search, and community organizing tools.

## 🚀 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router DOM
- Zustand (State Management)
- Supabase (Auth + Database)

**Backend:**
- Node.js + Express + TypeScript
- Supabase (PostgreSQL)
- OpenAI API (AI features)
- Playwright (Web scraping)

## 📦 Installation

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account
- OpenAI API key

### Setup Steps

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd shelter-rights
```

2. **Setup Frontend**
```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your Supabase credentials
```

3. **Setup Backend**
```bash
   cd ../backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
```

4. **Run Development Servers**

Terminal 1 - Frontend:
```bash
   cd frontend
   npm run dev
```

Terminal 2 - Backend:
```bash
   cd backend
   npm run dev
```

5. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 🏗️ Project Structure
```
shelter-rights/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Route pages
│   │   ├── stores/       # Zustand state stores
│   │   ├── lib/          # Utilities & API clients
│   │   └── types/        # TypeScript types
├── backend/           # Express backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Express middleware
```

## 🎯 Development Phases

- [x] Phase 0: Project Setup & Architecture
- [ ] Phase 1: Auth & User Profiles
- [ ] Phase 2: Renter Features
- [ ] Phase 3: Buyer Features
- [ ] Phase 4: Shared Features & Polish
- [ ] Phase 5: Deployment

## 📝 Environment Variables

See `.env.example` files in frontend and backend directories for required environment variables.

## 🤝 Contributing

This project is being built for CodeSpring Hackathon 2024.

## 📄 License

MIT

---

Built with ❤️ for housing justice

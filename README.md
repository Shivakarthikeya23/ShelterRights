# ShelterRights - Housing Affordability & Advocacy Platform

A robust, modern platform designed to empower renters and homebuyers with data-driven insights and community organizing tools. Built for high-impact advocacy and personal financial security.

## 🚀 Key Features

### 1. Rent Burden Calculator (`/rent-calculator`)
- **Real-time Analysis:** Instant feedback on housing affordability as you type.
- **Visual Insights:** High-quality charts (Bar & Pie) comparing your costs to federal guidelines.
- **AI Financial Coach:** Gemini-powered situational analysis with practical steps to reduce burden.

### 2. Homebuyer Affordability (`/buy-calculator`)
- **Realistic Budgeting:** Compares "Bank Max" loan limits against sustainable living data.
- **Hidden Costs:** Breakdown of property tax, maintenance, and insurance impact.
- **Buy Signals:** Automated readiness score based on savings and credit.

### 3. AI Property Search (`/search`)
- **Aggregated Listings:** Split-screen map view powered by Mapbox.
- **True Cost Engine:** Automated calculation of the total cost of ownership for every listing.

### 4. Tenant Rights Assistant (`/rights-chatbot`)
- **State-Specific IQ:** AI chatbot trained on local housing laws (TX, NY, CA, FL, etc.).
- **Proactive Advice:** Instant answers to evictions, repairs, and security deposit disputes.

### 5. Community Organizer (`/organize`)
- **Micro-Campaigns:** Launch and sign local housing petitions in seconds.
- **Automated Copywriting:** AI generates compelling campaign descriptions for maximum impact.

---

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS (Premium Configuration)
- Framer Motion (Animations)
- Recharts (Data Viz)
- Mapbox GL JS (Maps)
- Zustand (State)

**Backend:**
- Node.js + Express + TypeScript
- Supabase (PostgreSQL + Auth)
- Google Gemini AI (Generative Models)
- Playwright (Property Scrapers)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Supabase Account
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your Supabase and Gemini keys
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your Supabase URL and Mapbox Token
npm run dev
```

## 🎯 Success Criteria
- ✅ 100% Mobile Responsive
- ✅ Sub-3s Load Times
- ✅ Accessible UI (WCAG 2.1)
- ✅ Production-ready Auth patterns

---
*Built with ❤️ for Housing Justice and the 131 Million Americans struggling with affordability.*

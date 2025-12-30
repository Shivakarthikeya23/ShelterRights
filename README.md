# ShelterRights - Housing Affordability & Advocacy Platform

**A comprehensive platform helping renters and homebuyers navigate the housing crisis through affordability calculators, tenant rights assistance, property search, and community organizing tools.**

## 🎯 What is ShelterRights?

ShelterRights empowers individuals facing housing challenges with AI-powered tools, financial calculators, and community organizing features. Whether you're struggling with rent burden, planning to buy your first home, or organizing for tenant rights - we've got you covered.

## ✨ Implemented Features

### 🏠 For Renters:
1. **Rent Burden Calculator** - Analyze your housing costs against the "30% Rule" with Gemini AI-powered financial insights and recommendations
2. **Tenant Rights AI Chatbot** - Get instant answers about tenant rights and housing laws specific to your state
3. **Community Organizer** - Create and sign petitions for housing justice in your community with AI-generated campaign descriptions
4. **AI Property Search** - Search rental listings with automated affordability analysis and true cost calculations

### 🏡 For Homebuyers:
1. **Buying Power Calculator** - Compare what banks approve vs. what you can realistically afford with detailed monthly breakdowns
2. **Rent vs Buy Analyzer** - Financial analysis tool comparing the total cost of renting versus buying over time with break-even calculations
3. **Down Payment Assistance Finder** - Discover federal, state, and local programs (FHA, VA, USDA, state programs) to help with your down payment
4. **AI Property Search** - Search properties for purchase with AI-powered recommendations, mortgage calculations, and affordability analysis

### 🏘️ For Homeowners:
1. **Property Tax Burden Check** - Analyze your property tax burden and project future increases to understand long-term affordability
2. **Refinance Analyzer** - Determine if refinancing your mortgage makes financial sense based on current rates
3. **HOA Abuse Tracker** - Track HOA fee increases and compare with community data to identify potential abuse
4. **Foreclosure Prevention** - Get immediate help if you're falling behind on payments with connections to assistance programs

### 🔐 Core Features:
- **Authentication System** - Secure signup/login with Supabase Auth
- **User Profiles** - Customizable profiles with full name, income, location (city, state, zip), and housing preferences
- **Mode Switching** - Seamlessly switch between Renter, Buyer, and Owner modes with dynamic feature display
- **All 50 US States** - Complete state selection in all dropdowns (profile setup, property search, chat)
- **Formatted AI Responses** - Markdown-formatted chat responses with proper styling
- **Location-Based Property Search** - Property search filters by city and state with location-specific results
- **Back Navigation** - Back buttons on all feature pages for better UX
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Beautiful Landing Page** - Marketing page with feature showcases and CTAs

## 🚀 Tech Stack

### Frontend:
- **React 18** with TypeScript
- **Vite 5** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **React Router DOM 6** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **React Hook Form + Zod** - Form validation
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive data visualizations
- **Lucide React** - Icon library

### Backend:
- **Node.js 20** with TypeScript
- **Express 4** - Web framework
- **Supabase** - PostgreSQL database + Authentication
- **Google Gemini AI** - AI-powered analysis and recommendations
- **CORS, Helmet, Morgan** - Security and logging middleware

## 📦 Installation & Setup

### Prerequisites:
- Node.js 20+ and npm
- Supabase account (free tier works)
- Google Gemini API key (optional - fallbacks provided)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shivakarthikeya23/ShelterRights.git
cd ShelterRights
```

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 3: Database Setup
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the entire `DATABASE_SCHEMA.sql` file from the project root
4. Verify all tables were created in the Table Editor

### Step 4: Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Step 6: Access the Application
Open your browser to `http://localhost:5173`

## 🎨 Usage Guide

### Getting Started:
1. **Sign Up** - Create an account on the landing page
2. **Complete Profile** - Add your income, location, and select your mode (Renter/Buyer)
3. **Access Dashboard** - View all available tools for your selected mode
4. **Switch Modes** - Use the mode switcher in the header to access different toolsets

### For Renters:
- Use **Rent Calculator** to see if your rent is affordable (input income + rent)
- Chat with **Tenant Rights AI** to learn about your rights in your state
- Browse and sign **Community Campaigns** to join local housing justice efforts
- Search properties with **AI Property Search** to find affordable rentals

### For Homebuyers:
- Calculate your buying power with the **Buying Power Calculator** (income + savings + debts)
- Run **Rent vs Buy** analysis to see if buying makes financial sense
- Find assistance programs with **Down Payment Assistance** finder
- Search properties for purchase with mortgage calculations and affordability analysis

### For Homeowners:
- Check your **Property Tax Burden** and see future projections
- Analyze **Refinance** opportunities to save money
- Track **HOA Fees** and identify potential abuse
- Get **Foreclosure Prevention** help if you're falling behind

## 🎬 Demo Flow (For Presentations)

1. **Landing Page** → Show hero section and features
2. **Sign Up** → Quick registration
3. **Profile Setup** → Input $60k income, Austin TX, select Renter mode
4. **Dashboard** → Show 4 renter tools
5. **Rent Calculator** → Input $1800/month rent → Show 36% burden + AI analysis
6. **Rights Chatbot** → Ask "Can my landlord raise rent?" → Get AI response
7. **Organize** → Show active campaigns, sign one
8. **Switch to Buyer Mode** → Dashboard shows 4 different tools
9. **Buy Calculator** → Show affordability analysis
10. **Rent vs Buy** → Display break-even chart over 10 years

## 📊 API Endpoints

### Auth & Users:
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/setup` - Initial profile setup
- `POST /api/users/switch-mode` - Switch between renter/buyer/owner

### Renter Features:
- `POST /api/renter/calculate-rent` - Calculate rent burden with AI analysis
- `GET /api/renter/calculations` - Get calculation history
- `POST /api/renter/chat` - Chat with tenant rights AI
- `GET /api/renter/chat-history` - Get chat history
- `GET /api/renter/campaigns` - Get active campaigns
- `POST /api/renter/campaigns` - Create campaign
- `POST /api/renter/campaigns/:id/sign` - Sign campaign

### Property Search:
- `POST /api/property/search` - Search properties with AI ranking

## 🗄️ Database Schema

The application uses 7 main tables:
- `user_profiles` - User information and preferences
- `rent_calculations` - Saved rent burden calculations
- `buyer_calculations` - Saved buying power calculations
- `chat_history` - Tenant rights chat conversations
- `campaigns` - Community organizing campaigns
- `signatures` - Campaign signatures
- `saved_properties` - Favorited properties

See `DATABASE_SCHEMA.sql` for complete schema with Row Level Security policies and triggers.

## 🤖 AI Integration

### Google Gemini AI is used for:
1. **Rent Burden Analysis** - Personalized financial advice based on your situation
2. **Tenant Rights Q&A** - State-specific housing law information
3. **Property Analysis** - Pros/cons and red flags for listings
4. **Campaign Descriptions** - Auto-generate compelling petition text

### Graceful Fallbacks:
- All AI features work WITHOUT an API key (fallback messages provided)
- Logic-based calculations always work regardless of AI status
- Smart error handling ensures app never crashes due to AI failures

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- JWT-based authentication via Supabase
- CORS protection
- Helmet.js security headers
- Environment variable protection
- XSS and injection attack prevention

## 🎨 Design System

- **Colors**: Blue (primary), Purple (secondary), Green (success), Red (danger)
- **Typography**: Inter font family
- **Components**: shadcn/ui with custom theming
- **Animations**: Framer Motion for smooth transitions
- **Dark Mode**: Full support with smooth transitions

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🐛 Troubleshooting

### "Profile not found" error:
- The auto-create trigger might not be set up. Run `DATABASE_SCHEMA.sql` again.

### AI analysis says "unavailable":
- Add your Gemini API key to `backend/.env`
- Restart the backend server

### CORS errors:
- Verify `FRONTEND_URL` in backend `.env` matches your frontend port
- Restart backend after .env changes

### Properties not loading:
- Property search uses mock data for demo purposes
- 6 sample properties are hardcoded in `backend/src/controllers/property.controller.ts`

## 🚧 Known Limitations

1. **Property Search** uses location-based mock data - generates properties based on city/state but not live scraping
2. **Gemini AI** requires API key for full functionality (fallbacks provided)
3. **Map features** are placeholders (Mapbox integration not completed)
4. **Calculation history UI** exists in backend but not fully displayed in frontend
5. **Dark Mode Toggle** removed from header (system preference used instead)

## ✅ Recent Updates & Fixes

### UI/UX Improvements:
- ✅ Fixed chat UI formatting - AI responses now properly formatted with markdown
- ✅ Added all 50 US states to all dropdowns (chat, profile, property search)
- ✅ Fixed property search to filter by city/state (no more Austin results for Detroit searches)
- ✅ Added headers to all buyer feature pages
- ✅ Added back buttons to all feature pages for better navigation
- ✅ Removed duplicate AI Property Search from buyer dashboard
- ✅ Removed dark mode toggle button (using system preference)

### New Features:
- ✅ Added 4 homeowner features (Property Tax, Refinance, HOA Tracker, Foreclosure Prevention)
- ✅ Location-based property generation in search results
- ✅ Enhanced property search with rental vs purchase modes
- ✅ Down payment input for purchase searches
- ✅ Comprehensive profile management with full name, income, location

### Bug Fixes:
- ✅ Fixed profile update duplicate key errors
- ✅ Fixed camelCase/snake_case data mapping issues
- ✅ Fixed mode switcher visibility and functionality
- ✅ Fixed property search type handling (rental vs purchase)

## 🎯 Future Enhancements

- Live property scraping from Zillow/Craigslist
- Interactive maps with property pins
- Email notifications for campaigns
- Social sharing features
- Advanced analytics dashboard
- Mobile app (React Native)
- Landlord review system

## 📄 License

MIT License - Feel free to use this project for your own purposes.

## 🤝 Contributing

This project was built for the CodeSpring Hackathon 2024. Contributions welcome!

## 📧 Support

For issues or questions, please file an issue on the GitHub repository.

---

**Built with ❤️ for housing justice**

*"131 Million Americans struggle with housing affordability. ShelterRights helps them fight back."*

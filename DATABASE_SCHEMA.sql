-- SHELTERRIGHTS DATABASE SCHEMA - UPDATED
-- Supabase PostgreSQL Database Setup
-- Run this SQL in your Supabase SQL Editor
-- 
-- IMPORTANT: This will DROP all existing tables and recreate them
-- Make sure to backup any important data first!

-- ============================================
-- DROP EXISTING TABLES (if they exist)
-- ============================================
DROP TABLE IF EXISTS signatures CASCADE;
DROP TABLE IF EXISTS saved_properties CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS buyer_calculations CASCADE;
DROP TABLE IF EXISTS rent_calculations CASCADE;
DROP TABLE IF EXISTS buyer_data CASCADE;
DROP TABLE IF EXISTS renter_data CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP VIEW IF EXISTS campaign_stats CASCADE;

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  is_renter BOOLEAN DEFAULT false,
  is_buyer BOOLEAN DEFAULT false,
  is_owner BOOLEAN DEFAULT false,
  is_advocate BOOLEAN DEFAULT false,
  current_mode TEXT DEFAULT 'renter' CHECK (current_mode IN ('renter', 'buyer', 'owner')),
  annual_income NUMERIC,
  location_city TEXT,
  location_state TEXT,
  location_zip TEXT,
  saved_searches JSONB DEFAULT '{}',
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================
-- RENTER DATA TABLE
-- ============================================
CREATE TABLE renter_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_rent NUMERIC,
  utilities_cost NUMERIC,
  commute_cost NUMERIC,
  other_housing_costs NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE renter_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own renter data" ON renter_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own renter data" ON renter_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own renter data" ON renter_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX idx_renter_data_user_id ON renter_data(user_id);

-- ============================================
-- BUYER DATA TABLE
-- ============================================
CREATE TABLE buyer_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  down_payment NUMERIC,
  credit_score INTEGER,
  debt_amount NUMERIC,
  monthly_debt_payments NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE buyer_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own buyer data" ON buyer_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own buyer data" ON buyer_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own buyer data" ON buyer_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX idx_buyer_data_user_id ON buyer_data(user_id);

-- ============================================
-- RENT CALCULATIONS TABLE
-- ============================================
CREATE TABLE rent_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  annual_income NUMERIC NOT NULL,
  monthly_rent NUMERIC NOT NULL,
  location_city TEXT,
  location_state TEXT,
  burden_percentage NUMERIC NOT NULL,
  monthly_overpayment NUMERIC,
  annual_overpayment NUMERIC,
  recommended_rent NUMERIC,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE rent_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calculations" ON rent_calculations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations" ON rent_calculations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations" ON rent_calculations
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_rent_calculations_user_id ON rent_calculations(user_id);
CREATE INDEX idx_rent_calculations_created_at ON rent_calculations(created_at DESC);

-- ============================================
-- BUYER CALCULATIONS TABLE
-- ============================================
CREATE TABLE buyer_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  annual_income NUMERIC NOT NULL,
  down_payment NUMERIC NOT NULL,
  debt_amount NUMERIC,
  credit_score INTEGER,
  bank_approval_amount NUMERIC,
  realistic_affordable_amount NUMERIC,
  monthly_payment NUMERIC,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE buyer_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own buyer calcs" ON buyer_calculations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own buyer calcs" ON buyer_calculations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own buyer calcs" ON buyer_calculations
  FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_buyer_calculations_user_id ON buyer_calculations(user_id);
CREATE INDEX idx_buyer_calculations_created_at ON buyer_calculations(created_at DESC);

-- ============================================
-- CHAT HISTORY TABLE (Tenant Rights)
-- ============================================
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  state TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat history" ON chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat history" ON chat_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history" ON chat_history
  FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_state ON chat_history(state);

-- ============================================
-- CAMPAIGNS TABLE (Community Organizing)
-- ============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_city TEXT,
  location_state TEXT,
  location_zip TEXT,
  goal_signatures INTEGER DEFAULT 100,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'won')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active campaigns" ON campaigns
  FOR SELECT USING (status = 'active' OR auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = creator_id);

-- Indexes
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_location ON campaigns(location_state, location_city);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX idx_campaigns_creator_id ON campaigns(creator_id);

-- ============================================
-- SIGNATURES TABLE (Campaign Signatures)
-- ============================================
CREATE TABLE signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- RLS Policies
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view signatures" ON signatures
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can sign" ON signatures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own signatures" ON signatures
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_signatures_campaign_id ON signatures(campaign_id);
CREATE INDEX idx_signatures_user_id ON signatures(user_id);

-- ============================================
-- SAVED PROPERTIES TABLE
-- ============================================
CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_data JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved properties" ON saved_properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved properties" ON saved_properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved properties" ON saved_properties
  FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_saved_properties_user_id ON saved_properties(user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_renter_data_updated_at
  BEFORE UPDATE ON renter_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_data_updated_at
  BEFORE UPDATE ON buyer_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_history_updated_at
  BEFORE UPDATE ON chat_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup with ALL modes enabled by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, is_renter, is_buyer, is_owner, current_mode)
  VALUES (NEW.id, true, true, true, 'renter')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEWS (Optional - for convenience)
-- ============================================

-- Campaign signatures count view
CREATE OR REPLACE VIEW campaign_stats AS
SELECT 
  c.*,
  COUNT(s.id) as signature_count,
  (COUNT(s.id)::FLOAT / NULLIF(c.goal_signatures, 0) * 100) as progress_percentage
FROM campaigns c
LEFT JOIN signatures s ON c.id = s.campaign_id
GROUP BY c.id;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything was created correctly:

-- Check all tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public';

-- Check policies exist
-- SELECT tablename, policyname FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- ============================================
-- NOTES FOR DEPLOYMENT
-- ============================================

/*
IMPORTANT SETUP STEPS:

1. Run this entire SQL script in your Supabase SQL Editor
2. Verify all tables were created: Go to Table Editor
3. Test Row Level Security:
   - Try to insert a user_profile after signup
   - Verify you can only see your own data
4. Enable Realtime (optional):
   - Go to Database > Replication
   - Enable replication for campaigns and signatures tables
5. Set up Storage buckets (if adding file uploads later):
   - Create 'avatars' bucket for profile pictures
   - Create 'campaign-images' bucket for campaign photos

TROUBLESHOOTING:

If profile auto-creation doesn't work:
- Check that the trigger exists: SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
- Verify the function exists: SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
- Test manually: INSERT INTO auth.users ... and check if profile was created

If RLS is blocking operations:
- Temporarily disable for testing: ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
- Check auth.uid() returns correct value: SELECT auth.uid();
- Verify policies: SELECT * FROM pg_policies WHERE tablename = 'your_table';

COLUMN MAPPING:
- Frontend sends: isBuyer, isRenter, isOwner, fullName, annualIncome, etc. (camelCase)
- Backend converts to: is_buyer, is_renter, is_owner, full_name, annual_income, etc. (snake_case)
- Database stores: snake_case (as defined in this schema)
*/

-- SHELTERRIGHTS DATABASE SCHEMA
-- Supabase PostgreSQL Database Setup
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
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

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, is_renter, current_mode)
  VALUES (NEW.id, true, 'renter');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- RENT CALCULATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rent_calculations (
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

-- Index for performance
CREATE INDEX idx_rent_calculations_user_id ON rent_calculations(user_id);
CREATE INDEX idx_rent_calculations_created_at ON rent_calculations(created_at DESC);

-- ============================================
-- BUYER CALCULATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS buyer_calculations (
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

-- ============================================
-- CHAT HISTORY TABLE (Tenant Rights)
-- ============================================
CREATE TABLE IF NOT EXISTS chat_history (
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

-- Index
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);

-- ============================================
-- CAMPAIGNS TABLE (Community Organizing)
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
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

-- Indexes
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_location ON campaigns(location_state, location_city);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);

-- ============================================
-- SIGNATURES TABLE (Campaign Signatures)
-- ============================================
CREATE TABLE IF NOT EXISTS signatures (
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

-- Indexes
CREATE INDEX idx_signatures_campaign_id ON signatures(campaign_id);
CREATE INDEX idx_signatures_user_id ON signatures(user_id);

-- ============================================
-- SAVED PROPERTIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saved_properties (
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

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_history_updated_at
  BEFORE UPDATE ON chat_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample campaigns for testing
/*
INSERT INTO campaigns (creator_id, title, description, location_city, location_state, goal_signatures)
VALUES 
  (auth.uid(), 'Cap Rent Increases at 5%', 'Rent increases in our city have averaged 15% annually. We demand a cap at 5% to match inflation.', 'Austin', 'TX', 500),
  (auth.uid(), 'Require Landlord Licensing', 'Hold landlords accountable with mandatory licensing and regular property inspections.', 'Austin', 'TX', 1000),
  (auth.uid(), 'Protect Tenants from No-Cause Evictions', 'End no-cause evictions that force families out of their homes without just cause.', 'San Francisco', 'CA', 750);
*/

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
- Check that the trigger exists: SELECT * FROM information_schema.triggers;
- Verify the function exists: SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
- Test manually: INSERT INTO auth.users ... and check if profile was created

If RLS is blocking operations:
- Temporarily disable for testing: ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
- Check auth.uid() returns correct value: SELECT auth.uid();
- Verify policies: SELECT * FROM pg_policies WHERE tablename = 'your_table';
*/

-- UGood Supabase 數據庫結構
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 啟用 RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'super-secret-jwt-token-with-at-least-32-characters-long';

-- 創建 profiles 表 (用戶資料)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建 troubles 表 (煩惱記錄)
CREATE TABLE IF NOT EXISTS troubles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'matched', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建 matches 表 (配對記錄)
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trouble_id UUID REFERENCES troubles(id) NOT NULL,
  matcher_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trouble_id, matcher_id)
);

-- 創建 blessings 表 (祝福記錄)
CREATE TABLE IF NOT EXISTS blessings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) NOT NULL,
  from_user_id UUID REFERENCES profiles(id) NOT NULL,
  to_user_id UUID REFERENCES profiles(id) NOT NULL,
  audio_url TEXT,
  text_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引以提升查詢性能
CREATE INDEX IF NOT EXISTS idx_troubles_user_id ON troubles(user_id);
CREATE INDEX IF NOT EXISTS idx_troubles_status ON troubles(status);
CREATE INDEX IF NOT EXISTS idx_matches_trouble_id ON matches(trouble_id);
CREATE INDEX IF NOT EXISTS idx_matches_matcher_id ON matches(matcher_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_blessings_match_id ON blessings(match_id);
CREATE INDEX IF NOT EXISTS idx_blessings_from_user_id ON blessings(from_user_id);
CREATE INDEX IF NOT EXISTS idx_blessings_to_user_id ON blessings(to_user_id);

-- 啟用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE troubles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;

-- RLS 策略 - profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS 策略 - troubles
CREATE POLICY "Users can view own troubles" ON troubles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own troubles" ON troubles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own troubles" ON troubles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS 策略 - matches (用戶可以看到與自己相關的配對)
CREATE POLICY "Users can view related matches" ON matches
  FOR SELECT USING (
    auth.uid() = matcher_id OR 
    auth.uid() = (SELECT user_id FROM troubles WHERE id = trouble_id)
  );
  
CREATE POLICY "Users can insert matches for others' troubles" ON matches
  FOR INSERT WITH CHECK (
    auth.uid() = matcher_id AND
    auth.uid() != (SELECT user_id FROM troubles WHERE id = trouble_id)
  );
  
CREATE POLICY "Users can update related matches" ON matches
  FOR UPDATE USING (
    auth.uid() = matcher_id OR 
    auth.uid() = (SELECT user_id FROM troubles WHERE id = trouble_id)
  );

-- RLS 策略 - blessings
CREATE POLICY "Users can view related blessings" ON blessings
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
  
CREATE POLICY "Users can insert own blessings" ON blessings
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- 創建 updated_at 觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為所有表添加 updated_at 觸發器
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_troubles_updated_at BEFORE UPDATE ON troubles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 測試數據插入函數 (可選)
CREATE OR REPLACE FUNCTION create_test_user(
  user_email TEXT,
  user_nickname TEXT,
  user_age INTEGER,
  user_gender TEXT
) RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- 這裡只是為了測試，實際用戶註冊會通過 Supabase Auth
  INSERT INTO profiles (id, email, nickname, age, gender)
  VALUES (gen_random_uuid(), user_email, user_nickname, user_age, user_gender)
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;
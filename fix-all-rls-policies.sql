-- 修復所有表的 RLS 政策 - 完整版
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- ===== PROFILES 表 =====
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 刪除舊政策
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 創建新政策
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ===== TROUBLES 表 =====
ALTER TABLE troubles ENABLE ROW LEVEL SECURITY;

-- 刪除舊政策
DROP POLICY IF EXISTS "Users can view own troubles" ON troubles;
DROP POLICY IF EXISTS "Users can insert own troubles" ON troubles;
DROP POLICY IF EXISTS "Users can update own troubles" ON troubles;
DROP POLICY IF EXISTS "Users can view active troubles for matching" ON troubles;

-- 創建新政策
CREATE POLICY "Users can view own troubles" ON troubles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own troubles" ON troubles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own troubles" ON troubles
  FOR UPDATE USING (auth.uid() = user_id);

-- 允許其他用戶查看活躍的煩惱（用於配對）
CREATE POLICY "Users can view active troubles for matching" ON troubles
  FOR SELECT USING (
    status = 'active' AND auth.uid() IS NOT NULL AND auth.uid() <> user_id
  );

-- ===== MATCHES 表 =====
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- 刪除舊政策
DROP POLICY IF EXISTS "Users can view related matches" ON matches;
DROP POLICY IF EXISTS "Users can insert matches for others troubles" ON matches;
DROP POLICY IF EXISTS "Users can update related matches" ON matches;
DROP POLICY IF EXISTS "Users can view own matches" ON matches;
DROP POLICY IF EXISTS "Users can insert own matches" ON matches;
DROP POLICY IF EXISTS "Users can update own matches" ON matches;

-- 創建新政策 - 用戶可以查看自己創建的配對或與自己煩惱相關的配對
CREATE POLICY "Users can view related matches" ON matches
  FOR SELECT USING (
    auth.uid() = matcher_id OR 
    auth.uid() = (SELECT user_id FROM troubles WHERE id = trouble_id)
  );

-- 用戶可以為其他人的煩惱創建配對
CREATE POLICY "Users can insert matches for others troubles" ON matches
  FOR INSERT WITH CHECK (
    auth.uid() = matcher_id AND
    auth.uid() <> (SELECT user_id FROM troubles WHERE id = trouble_id)
  );

-- 用戶可以更新與自己相關的配對
CREATE POLICY "Users can update related matches" ON matches
  FOR UPDATE USING (
    auth.uid() = matcher_id OR 
    auth.uid() = (SELECT user_id FROM troubles WHERE id = trouble_id)
  );

-- ===== BLESSINGS 表 =====
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;

-- 刪除舊政策
DROP POLICY IF EXISTS "Users can view own blessings" ON blessings;
DROP POLICY IF EXISTS "Users can insert own blessings" ON blessings;
DROP POLICY IF EXISTS "Users can update own blessings" ON blessings;

-- 創建新政策
CREATE POLICY "Users can view related blessings" ON blessings
  FOR SELECT USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
  );

CREATE POLICY "Users can insert own blessings" ON blessings
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update own blessings" ON blessings
  FOR UPDATE USING (auth.uid() = from_user_id);

-- 檢查所有表的 RLS 狀態
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'troubles', 'matches', 'blessings')
ORDER BY tablename;

-- 檢查所有政策
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'troubles', 'matches', 'blessings')
ORDER BY tablename, policyname;
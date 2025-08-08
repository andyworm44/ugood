-- UGood Supabase RLS 政策修復腳本 (安全版本)
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 確保所有相關表啟用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE troubles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;

-- 安全刪除所有可能存在的舊政策
DO $$ 
BEGIN
    -- profiles 表政策
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    
    -- troubles 表政策
    DROP POLICY IF EXISTS "Users can view own troubles" ON troubles;
    DROP POLICY IF EXISTS "Users can insert own troubles" ON troubles;
    DROP POLICY IF EXISTS "Users can update own troubles" ON troubles;
    DROP POLICY IF EXISTS "Users can view active troubles for matching" ON troubles;
    
    -- matches 表政策
    DROP POLICY IF EXISTS "Users can view related matches" ON matches;
    DROP POLICY IF EXISTS "Users can insert matches for others' troubles" ON matches;
    DROP POLICY IF EXISTS "Users can update related matches" ON matches;
    
    -- blessings 表政策
    DROP POLICY IF EXISTS "Users can insert blessings for related matches" ON blessings;
    DROP POLICY IF EXISTS "Users can view blessings for related matches" ON blessings;
    DROP POLICY IF EXISTS "Users can view related blessings" ON blessings;
    
    RAISE NOTICE '✅ 舊政策清理完成';
END $$;

-- 創建新的 RLS 策略

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

-- 允許其他用戶查看活躍的煩惱（用於配對）
CREATE POLICY "Users can view active troubles for matching" ON troubles
  FOR SELECT USING (
    status = 'active' AND auth.uid() IS NOT NULL AND auth.uid() <> user_id
  );

-- RLS 策略 - matches
-- 用戶可以看到與自己相關的配對 (作為 matcher 或 trouble owner)
CREATE POLICY "Users can view related matches" ON matches
  FOR SELECT USING (
    auth.uid() = matcher_id OR
    auth.uid() = (SELECT user_id FROM troubles WHERE id = trouble_id)
  );

-- 用戶可以為其他人的煩惱插入配對記錄
CREATE POLICY "Users can insert matches for others' troubles" ON matches
  FOR INSERT WITH CHECK (
    auth.uid() = matcher_id AND
    auth.uid() != (SELECT user_id FROM troubles WHERE id = trouble_id)
  );

-- 用戶可以更新與自己相關的配對 (例如更新狀態)
CREATE POLICY "Users can update related matches" ON matches
  FOR UPDATE USING (
    auth.uid() = matcher_id OR
    auth.uid() = (SELECT user_id FROM troubles WHERE id = trouble_id)
  );

-- RLS 策略 - blessings
-- 用戶可以為相關配對插入祝福語音
CREATE POLICY "Users can insert blessings for related matches" ON blessings
  FOR INSERT WITH CHECK (
    auth.uid() = from_user_id AND
    (auth.uid() = (SELECT matcher_id FROM matches WHERE id = match_id) OR
     auth.uid() = (SELECT user_id FROM troubles WHERE id = (SELECT trouble_id FROM matches WHERE id = match_id)))
  );

-- 用戶可以查看與自己相關的祝福語音
CREATE POLICY "Users can view related blessings" ON blessings
  FOR SELECT USING (
    auth.uid() = from_user_id OR
    auth.uid() = to_user_id
  );

-- 顯示所有 RLS 政策以供檢查
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'troubles', 'matches', 'blessings')
ORDER BY tablename, policyname;

-- 完成訊息
DO $$ 
BEGIN
    RAISE NOTICE '🎉 RLS 政策修復完成！現在可以測試配對功能了。';
END $$;
-- 修復 matches 表的 RLS 政策
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 確保 matches 表啟用 RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- 刪除可能存在的舊政策
DROP POLICY IF EXISTS "Users can view own matches" ON matches;
DROP POLICY IF EXISTS "Users can insert own matches" ON matches;
DROP POLICY IF EXISTS "Users can update own matches" ON matches;

-- 創建新的 RLS 政策 - 用戶可以查看自己的配對
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = matched_user_id
  );

-- 創建新的 RLS 政策 - 用戶可以插入自己的配對
CREATE POLICY "Users can insert own matches" ON matches
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- 創建新的 RLS 政策 - 用戶可以更新自己的配對
CREATE POLICY "Users can update own matches" ON matches
  FOR UPDATE USING (
    auth.uid() = user_id OR auth.uid() = matched_user_id
  );

-- 檢查 matches 表結構
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'matches' 
ORDER BY ordinal_position;
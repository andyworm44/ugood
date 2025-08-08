-- 修復 blessings 表的 RLS 政策
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 確保 blessings 表啟用 RLS
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;

-- 刪除可能存在的舊政策
DROP POLICY IF EXISTS "Users can view own blessings" ON blessings;
DROP POLICY IF EXISTS "Users can insert own blessings" ON blessings;
DROP POLICY IF EXISTS "Users can update own blessings" ON blessings;

-- 創建新的 RLS 政策 - 用戶可以查看自己的祝福
CREATE POLICY "Users can view own blessings" ON blessings
  FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = recipient_id
  );

-- 創建新的 RLS 政策 - 用戶可以插入自己的祝福
CREATE POLICY "Users can insert own blessings" ON blessings
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- 創建新的 RLS 政策 - 用戶可以更新自己的祝福
CREATE POLICY "Users can update own blessings" ON blessings
  FOR UPDATE USING (
    auth.uid() = user_id OR auth.uid() = recipient_id
  );

-- 檢查 blessings 表結構
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blessings' 
ORDER BY ordinal_position;
-- 修復 troubles 表的 RLS 政策
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 確保 troubles 表啟用 RLS
ALTER TABLE troubles ENABLE ROW LEVEL SECURITY;

-- 刪除可能存在的舊政策
DROP POLICY IF EXISTS "Users can view own troubles" ON troubles;
DROP POLICY IF EXISTS "Users can insert own troubles" ON troubles;
DROP POLICY IF EXISTS "Users can update own troubles" ON troubles;

-- 創建新的 RLS 政策 - 用戶可以查看自己的煩惱
CREATE POLICY "Users can view own troubles" ON troubles
  FOR SELECT USING (auth.uid() = user_id);

-- 創建新的 RLS 政策 - 用戶可以插入自己的煩惱  
CREATE POLICY "Users can insert own troubles" ON troubles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 創建新的 RLS 政策 - 用戶可以更新自己的煩惱
CREATE POLICY "Users can update own troubles" ON troubles
  FOR UPDATE USING (auth.uid() = user_id);

-- 創建新的 RLS 政策 - 允許其他用戶查看活躍的煩惱（用於配對）
CREATE POLICY "Users can view active troubles for matching" ON troubles
  FOR SELECT USING (
    status = 'active' AND auth.uid() != user_id
  );
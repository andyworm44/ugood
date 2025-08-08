-- 修復 RLS 政策 - 更寬鬆的版本
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 確保 RLS 是啟用的
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Allow all operations for now" ON profiles;

-- 創建新的寬鬆政策，允許已認證用戶插入資料
CREATE POLICY "Allow authenticated users to insert" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- 保留查看和更新自己資料的政策
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
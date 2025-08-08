-- 臨時禁用 RLS 以測試註冊功能
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 禁用 profiles 表的 RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 或者，如果您想保留 RLS 但允許所有操作（更安全的臨時方案）
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
-- CREATE POLICY "Allow all operations for now" ON profiles FOR ALL USING (true) WITH CHECK (true);
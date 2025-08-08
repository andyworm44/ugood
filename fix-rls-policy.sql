-- 修復 RLS 政策以允許新用戶註冊
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 刪除現有的插入政策
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 創建新的插入政策，允許已認證用戶插入自己的資料
CREATE POLICY "Enable insert for authenticated users based on user_id" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 如果上面的政策還是有問題，使用更寬鬆的臨時政策
-- DROP POLICY IF EXISTS "Enable insert for authenticated users based on user_id" ON profiles;
-- CREATE POLICY "Allow insert for authenticated users" ON profiles
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');
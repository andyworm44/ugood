-- 手動確認用戶郵箱
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 確認 andyworm44@gmail.com 的郵箱
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'andyworm44@gmail.com' 
  AND email_confirmed_at IS NULL;

-- 檢查更新結果
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'andyworm44@gmail.com';
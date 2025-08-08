-- 檢查用戶狀態和手動確認郵箱
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 檢查 gender.fixed.test@gmail.com 的狀態
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'gender.fixed.test@gmail.com';

-- 如果用戶存在但郵箱未確認，執行以下語句來確認郵箱
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'gender.fixed.test@gmail.com' 
  AND email_confirmed_at IS NULL;

-- 再次檢查更新後的狀態
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'gender.fixed.test@gmail.com';
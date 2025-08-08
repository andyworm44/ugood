-- 禁用郵箱驗證（僅適用於開發環境）
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 注意：這會影響所有新註冊的用戶
-- 生產環境請勿使用此設定

-- 方法1: 透過 SQL 更新設定（可能需要重啟）
-- 這個方法可能不會立即生效，建議使用 Dashboard 設定

-- 方法2: 請到 Supabase Dashboard 進行設定
-- 1. 進入 Authentication > Settings
-- 2. 找到 "Confirm email" 選項
-- 3. 將其設為 "disabled"
-- 4. 點擊 "Save"

-- 同時確認現有用戶的郵箱
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email_confirmed_at IS NULL;
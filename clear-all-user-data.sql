-- 清理所有用戶數據腳本
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本
-- 注意：此操作將永久刪除所有配對和煩惱數據，請謹慎執行

-- 顯示清理前的數據統計
SELECT 'BEFORE CLEANUP - matches' as info, COUNT(*) as count FROM matches
UNION ALL
SELECT 'BEFORE CLEANUP - blessings' as info, COUNT(*) as count FROM blessings
UNION ALL
SELECT 'BEFORE CLEANUP - troubles' as info, COUNT(*) as count FROM troubles
UNION ALL
SELECT 'BEFORE CLEANUP - profiles' as info, COUNT(*) as count FROM profiles;

-- 1. 由於外鍵約束，需要按順序清理
-- 首先清理 blessings（依賴於 matches）
DELETE FROM blessings;

-- 然後清理 matches（依賴於 troubles）
DELETE FROM matches;

-- 最後清理 troubles（依賴於 profiles）
DELETE FROM troubles;

-- 注意：不刪除 profiles 表，因為這會影響用戶登入
-- 如果您也想清理用戶資料，請取消以下註釋：
-- DELETE FROM profiles;

-- 檢查清理結果
SELECT 'AFTER CLEANUP - matches' as table_info, COUNT(*) as remaining_count FROM matches
UNION ALL
SELECT 'AFTER CLEANUP - blessings' as table_info, COUNT(*) as remaining_count FROM blessings
UNION ALL
SELECT 'AFTER CLEANUP - troubles' as table_info, COUNT(*) as remaining_count FROM troubles
UNION ALL
SELECT 'AFTER CLEANUP - profiles' as table_info, COUNT(*) as remaining_count FROM profiles;

-- 顯示用戶帳號狀態（確認用戶帳號未被刪除）
SELECT 'auth.users' as table_info, COUNT(*) as total_users FROM auth.users;

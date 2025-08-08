-- 清理配對數據腳本
-- 請在 Supabase Dashboard 的 SQL Editor 中執行此腳本

-- 清理所有配對記錄
DELETE FROM matches;

-- 清理所有祝福記錄
DELETE FROM blessings;

-- 重置所有煩惱狀態為 active（如果需要的話）
UPDATE troubles 
SET status = 'active' 
WHERE status != 'active';

-- 檢查清理結果
SELECT 'matches' as table_name, COUNT(*) as remaining_count FROM matches
UNION ALL
SELECT 'blessings' as table_name, COUNT(*) as remaining_count FROM blessings
UNION ALL
SELECT 'troubles (active)' as table_name, COUNT(*) as remaining_count FROM troubles WHERE status = 'active';

-- 顯示現有的煩惱（用於測試配對）
SELECT 
  id,
  user_id,
  content,
  status,
  created_at
FROM troubles 
ORDER BY created_at DESC;
-- 快速清理配對和煩惱數據
-- 執行前請確認您要清除所有數據

-- 清理祝福
DELETE FROM blessings;

-- 清理配對
DELETE FROM matches;

-- 清理煩惱
DELETE FROM troubles;

-- 顯示清理結果
SELECT 
  'blessings' as table_name, 
  COUNT(*) as count 
FROM blessings
UNION ALL
SELECT 
  'matches' as table_name, 
  COUNT(*) as count 
FROM matches
UNION ALL
SELECT 
  'troubles' as table_name, 
  COUNT(*) as count 
FROM troubles;

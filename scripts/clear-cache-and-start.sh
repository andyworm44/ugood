#!/bin/bash

echo "🧹 清理快取並重新啟動開發伺服器..."

# 停止可能正在運行的進程
echo "📱 停止現有進程..."
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true

# 清理 npm 快取
echo "🗑️  清理 npm 快取..."
npm cache clean --force

# 清理 Expo 快取
echo "🗑️  清理 Expo 快取..."
rm -rf .expo
rm -rf node_modules/.cache

# 清理 Metro 快取
echo "🗑️  清理 Metro 快取..."
npx metro --reset-cache 2>/dev/null || true

# 重新安裝依賴（可選，如果需要的話取消註釋）
# echo "📦 重新安裝依賴..."
# rm -rf node_modules package-lock.json
# npm install

echo "🚀 啟動開發伺服器（清理模式）..."
npx expo start --web --clear --reset-cache

echo "✅ 完成！請在瀏覽器中開啟 http://localhost:19006"

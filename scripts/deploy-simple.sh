#!/bin/bash

echo "🚀 UGood 應用測試版發佈腳本"
echo "================================"

# 檢查是否在正確的目錄
if [ ! -f "package.json" ]; then
    echo "❌ 請在項目根目錄運行此腳本"
    exit 1
fi

echo "📋 發佈選項："
echo "1. 📱 Expo Go 分享（推薦）"
echo "2. 🏗️  EAS Build"
echo "3. 📊 查看項目狀態"

read -p "請選擇選項 (1-3): " choice

case $choice in
    1)
        echo "📱 啟動 Expo Go 分享模式..."
        echo "🔄 清理緩存並重新啟動..."
        npx expo start --clear --tunnel
        ;;
    2)
        echo "🏗️  準備 EAS Build..."
        echo "⚠️  需要 Expo 帳號登入"
        eas build --platform ios --profile preview
        ;;
    3)
        echo "📊 項目狀態："
        echo "✅ 真實錄音功能已實現"
        echo "✅ Expo SDK 53 已升級"
        echo "✅ 代碼已推送到 GitHub"
        echo "✅ 測試指南已創建"
        echo ""
        echo "🎯 當前可用的測試方式："
        echo "1. 運行 'npx expo start' 並分享 QR Code"
        echo "2. 朋友使用 Expo Go 掃描測試"
        echo "3. 支持真實錄音和播放功能"
        ;;
    *)
        echo "❌ 無效選項"
        exit 1
        ;;
esac

echo ""
echo "🎉 完成！" 
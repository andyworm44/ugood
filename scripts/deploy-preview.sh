#!/bin/bash

# UGood App 預覽版本發佈腳本
echo "🚀 開始發佈 UGood 測試版..."

# 檢查是否安裝了 EAS CLI
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI 未安裝，正在安裝..."
    npm install -g @expo/eas-cli
fi

# 檢查是否已登入
echo "🔐 檢查 Expo 登入狀態..."
if ! eas whoami &> /dev/null; then
    echo "請先登入 Expo 帳號："
    eas login
fi

# 清理並安裝依賴
echo "📦 安裝依賴..."
npm install

# 檢查 Firebase 配置
echo "🔥 檢查 Firebase 配置..."
if grep -q "your-api-key" firebase.config.js; then
    echo "⚠️  警告：Firebase 配置尚未更新，應用將使用模擬模式"
    echo "   請參考 FIREBASE_SETUP.md 設置真實的 Firebase 配置"
fi

# 構建預覽版本
echo "🔨 構建預覽版本..."
echo "選擇構建平台："
echo "1) iOS only"
echo "2) Android only" 
echo "3) 兩個平台都構建"
read -p "請選擇 (1-3): " choice

case $choice in
    1)
        echo "構建 iOS 預覽版本..."
        eas build --platform ios --profile preview --non-interactive
        ;;
    2)
        echo "構建 Android 預覽版本..."
        eas build --platform android --profile preview --non-interactive
        ;;
    3)
        echo "構建兩個平台的預覽版本..."
        eas build --platform all --profile preview --non-interactive
        ;;
    *)
        echo "無效選擇，預設構建 iOS 版本..."
        eas build --platform ios --profile preview --non-interactive
        ;;
esac

echo "✅ 構建完成！"
echo ""
echo "📱 下一步："
echo "1. 檢查 Expo Dashboard 中的構建狀態"
echo "2. 下載 .ipa/.apk 文件分享給測試者"
echo "3. 或者設置 TestFlight/Play Console 進行分發"
echo ""
echo "🔗 有用的連結："
echo "- Expo Dashboard: https://expo.dev/"
echo "- Apple Developer: https://developer.apple.com/"
echo "- Google Play Console: https://play.google.com/console/" 
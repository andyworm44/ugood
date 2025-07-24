# 🚀 UGood App 測試版發佈指南

## 📋 **發佈前準備**

### 1. **應用狀態檢查**
- ✅ 基本功能正常運行
- ✅ 註冊/登入流程完整
- ✅ UI/UX 適配良好
- ✅ SafeArea 問題已修復
- ✅ 錄音界面完整
- 🔄 需要設置真實 Firebase 配置

### 2. **必要的配置更新**

#### **更新 app.json**
```json
{
  "expo": {
    "name": "UGood - 你還好嗎",
    "slug": "ugood-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#8FBC8F"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourcompany.ugood"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#8FBC8F"
      },
      "package": "com.yourcompany.ugood"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

## 🔥 **Firebase 設置（重要）**

### 1. **創建 Firebase 項目**
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊 "創建項目"
3. 項目名稱：`ugood-app`
4. 啟用 Google Analytics（建議）

### 2. **添加應用**
1. 點擊 iOS 圖標添加 iOS 應用
2. iOS 套件 ID：`com.yourcompany.ugood`
3. 下載 `GoogleService-Info.plist`

4. 點擊 Android 圖標添加 Android 應用
5. Android 套件名稱：`com.yourcompany.ugood`
6. 下載 `google-services.json`

### 3. **啟用 Authentication**
1. 在 Firebase Console 中選擇 "Authentication"
2. 點擊 "開始使用"
3. 在 "Sign-in method" 標籤中啟用：
   - ✅ 電子郵件/密碼
   - ✅ 匿名（可選）

### 4. **設置 Firestore Database**
1. 選擇 "Firestore Database"
2. 點擊 "創建資料庫"
3. 選擇 "以測試模式開始"
4. 選擇地區（建議：asia-east1）

### 5. **更新本地配置**
將下載的配置文件內容更新到 `firebase.config.js`：

```javascript
const firebaseConfig = {
  apiKey: "你的-api-key",
  authDomain: "ugood-app.firebaseapp.com",
  projectId: "ugood-app",
  storageBucket: "ugood-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "你的-app-id"
};
```

---

## 📱 **EAS Build 設置**

### 1. **安裝 EAS CLI**
```bash
npm install -g @expo/eas-cli
```

### 2. **登入 Expo 帳號**
```bash
eas login
```

### 3. **初始化 EAS**
```bash
eas build:configure
```

### 4. **創建 eas.json**
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 🧪 **發佈測試版**

### **方案 1：Expo Go 測試（最簡單）**

#### **立即發佈**
```bash
# 發佈到 Expo Go
eas update --branch preview --message "測試版 v1.0.0"
```

#### **分享給測試者**
1. 生成分享 URL
2. 測試者下載 Expo Go App
3. 掃描 QR Code 或開啟連結

#### **優點**：
- ✅ 最快速的方式
- ✅ 不需要開發者帳號
- ✅ 即時更新

#### **缺點**：
- ❌ 功能有限制
- ❌ 無法測試原生功能
- ❌ 需要網路連接

---

### **方案 2：TestFlight（iOS）+ Google Play Console（Android）**

#### **iOS TestFlight**

1. **構建 iOS 版本**
```bash
eas build --platform ios --profile preview
```

2. **上傳到 App Store Connect**
```bash
eas submit --platform ios
```

3. **設置 TestFlight**
- 登入 [App Store Connect](https://appstoreconnect.apple.com)
- 選擇您的應用
- 前往 "TestFlight" 標籤
- 添加測試者（最多 10,000 人）

#### **Android Google Play Console**

1. **構建 Android 版本**
```bash
eas build --platform android --profile preview
```

2. **上傳到 Google Play Console**
```bash
eas submit --platform android
```

3. **設置內部測試**
- 登入 [Google Play Console](https://play.google.com/console)
- 前往 "測試" > "內部測試"
- 上傳 APK/AAB 文件
- 添加測試者電子郵件

---

## 🎯 **推薦發佈流程**

### **階段 1：內部測試（現在）**
```bash
# 1. 更新 Firebase 配置
# 2. 測試所有功能
npm run test

# 3. 構建預覽版本
eas build --platform all --profile preview

# 4. 發佈到測試平台
eas submit --platform all
```

### **階段 2：封閉 Beta 測試**
- 邀請 10-50 位朋友/同事測試
- 收集反饋和錯誤報告
- 修復主要問題

### **階段 3：公開 Beta 測試**
- 擴大測試範圍至 100-500 人
- 優化性能和用戶體驗
- 準備正式發佈

---

## 📋 **測試版檢查清單**

### **發佈前必須完成**：
- [ ] Firebase 配置已更新
- [ ] 應用圖標和啟動畫面已設計
- [ ] 隱私政策和使用條款已準備
- [ ] 測試所有核心功能
- [ ] 檢查不同設備的兼容性
- [ ] 設置錯誤追蹤（Sentry/Bugsnag）

### **可選但建議**：
- [ ] 添加分析工具（Firebase Analytics）
- [ ] 設置推送通知
- [ ] 添加應用內反饋系統
- [ ] 準備用戶指南

---

## 🚀 **立即開始步驟**

### **最快測試版發佈（5分鐘）**：

1. **更新 Firebase 配置**（最重要）
2. **構建預覽版本**：
   ```bash
   eas build --platform ios --profile preview
   ```
3. **分享給測試者**

### **需要幫助？**

如果您需要：
- ✅ Firebase 詳細設置指導
- ✅ Apple Developer 帳號申請
- ✅ Google Play Developer 帳號申請
- ✅ 應用圖標和啟動畫面設計
- ✅ 測試流程規劃

請告訴我您想從哪個步驟開始！

---

## 💡 **重要提醒**

1. **開發者帳號費用**：
   - Apple Developer：$99/年
   - Google Play Developer：$25 一次性

2. **Firebase 費用**：
   - Spark Plan（免費）：適合測試
   - Blaze Plan（按使用付費）：正式上線時需要

3. **測試建議**：
   - 先用 Expo Go 快速測試
   - 再用 TestFlight/Play Console 深度測試

**🎉 您的 UGood 應用已經準備好發佈測試版了！** 
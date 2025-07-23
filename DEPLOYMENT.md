# UGood App 部署指南

## 📋 部署前檢查清單

### ✅ 基本配置
- [ ] Firebase 項目已創建並配置
- [ ] Firebase Authentication 已啟用
- [ ] Firestore Database 已設置
- [ ] Firebase 配置已更新到 `App.tsx`
- [ ] 所有依賴已安裝 (`npm install`)
- [ ] 應用可在本地運行 (`npm start`)

### ✅ 應用商店準備
- [ ] 應用圖標已準備 (1024x1024 PNG)
- [ ] 啟動畫面已設計
- [ ] 應用描述和關鍵詞已準備
- [ ] 隱私政策已撰寫
- [ ] 應用截圖已準備

## 🍎 iOS App Store 部署

### 1. 前置需求

#### Apple Developer 帳號
- 註冊 [Apple Developer Program](https://developer.apple.com/programs/) ($99/年)
- 完成帳號驗證

#### 證書和描述文件
```bash
# 安裝 EAS CLI
npm install -g @expo/eas-cli

# 登入 Expo 帳號
eas login

# 配置 EAS Build
eas build:configure
```

### 2. 更新應用配置

更新 `app.json`:
```json
{
  "expo": {
    "name": "UGood",
    "slug": "ugood-app",
    "version": "1.0.0",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.ugood",
      "buildNumber": "1"
    }
  }
}
```

更新 `eas.json`:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}
```

### 3. 建置應用

```bash
# 建置 iOS 版本
eas build --platform ios --profile production

# 檢查建置狀態
eas build:list
```

### 4. 提交到 App Store

```bash
# 提交到 App Store Connect
eas submit --platform ios

# 或手動上傳 .ipa 文件到 App Store Connect
```

### 5. App Store Connect 設置

1. 登入 [App Store Connect](https://appstoreconnect.apple.com/)
2. 創建新應用
3. 填寫應用資訊：
   - 應用名稱: UGood
   - 副標題: 簡潔優雅的社交應用
   - 關鍵詞: 社交,分享,貼文,社群
   - 描述: (詳細的應用描述)
4. 上傳截圖 (6.5" 和 5.5" 顯示器)
5. 設置價格和可用性
6. 提交審核

## 🤖 Google Play Store 部署

### 1. 前置需求

#### Google Play Console 帳號
- 註冊 [Google Play Console](https://play.google.com/console/) ($25 一次性費用)
- 完成開發者帳號驗證

### 2. 更新應用配置

更新 `app.json`:
```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.ugood",
      "versionCode": 1
    }
  }
}
```

### 3. 建置應用

```bash
# 建置 Android 版本
eas build --platform android --profile production

# 檢查建置狀態
eas build:list
```

### 4. 提交到 Google Play

```bash
# 提交到 Google Play Console
eas submit --platform android
```

### 5. Google Play Console 設置

1. 登入 [Google Play Console](https://play.google.com/console/)
2. 創建新應用
3. 填寫應用詳情：
   - 應用名稱: UGood
   - 簡短描述: 簡潔優雅的社交應用
   - 完整描述: (詳細的應用描述)
4. 上傳圖形資源：
   - 應用圖標 (512x512)
   - 功能圖片 (1024x500)
   - 截圖 (手機和平板)
5. 設置內容分級
6. 設置目標受眾和內容
7. 提交審核

## 🔧 常見部署問題

### Q: iOS 建置失敗 - 證書問題

A: 解決步驟：
```bash
# 清除 EAS 憑證
eas credentials

# 重新生成憑證
eas build --platform ios --clear-cache
```

### Q: Android 建置失敗 - 簽名問題

A: 檢查：
1. `app.json` 中的 `package` 名稱是否唯一
2. 是否有有效的 Google Play 開發者帳號
3. 重新建置：
```bash
eas build --platform android --clear-cache
```

### Q: 應用被拒絕 - 內容政策

A: 常見原因和解決方案：
1. **隱私政策缺失**: 添加隱私政策頁面
2. **年齡分級不當**: 重新評估內容分級
3. **功能描述不清**: 更新應用描述和截圖
4. **測試帳號**: 提供測試帳號給審核人員

### Q: Firebase 連接問題

A: 檢查：
1. Firebase 配置是否正確
2. Firebase 專案是否啟用了所需服務
3. API 金鑰是否有效
4. 網路連接是否正常

## 📊 發布後監控

### 1. 分析工具設置

```bash
# 安裝 Firebase Analytics
npm install @react-native-firebase/analytics

# 安裝 Crashlytics
npm install @react-native-firebase/crashlytics
```

### 2. 性能監控

- 使用 Firebase Performance Monitoring
- 監控應用啟動時間
- 追蹤網路請求性能
- 監控記憶體使用

### 3. 用戶反饋

- 設置應用內反饋機制
- 監控應用商店評論
- 追蹤用戶留存率
- 分析用戶行為

## 🔄 更新版本

### 版本號管理

更新版本時需要修改：

1. **package.json**:
```json
{
  "version": "1.0.1"
}
```

2. **app.json**:
```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "2"
    },
    "android": {
      "versionCode": 2
    }
  }
}
```

### 發布更新

```bash
# 建置新版本
eas build --platform all --profile production

# 提交更新
eas submit --platform all
```

## 🛡️ 安全性檢查

### 發布前安全檢查

- [ ] API 金鑰不在客戶端代碼中暴露
- [ ] Firebase 安全規則已正確設置
- [ ] 用戶輸入已正確驗證和清理
- [ ] HTTPS 連接已啟用
- [ ] 敏感資料已加密存儲

### Firebase 安全規則範例

```javascript
// Firestore 安全規則
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用戶只能讀寫自己的資料
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 貼文規則
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.authorId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```

## 📈 行銷和推廣

### App Store 優化 (ASO)

1. **關鍵詞優化**:
   - 研究相關關鍵詞
   - 在標題和描述中使用關鍵詞
   - 定期更新關鍵詞策略

2. **視覺優化**:
   - 設計吸引人的應用圖標
   - 創建高質量的截圖
   - 製作應用預覽影片

3. **評論管理**:
   - 積極回應用戶評論
   - 鼓勵滿意用戶留下評論
   - 根據反饋改進應用

### 推廣策略

1. **社交媒體**:
   - 創建官方社交媒體帳號
   - 分享開發過程和更新
   - 與用戶互動

2. **內容行銷**:
   - 撰寫技術部落格文章
   - 參與開發者社群
   - 分享開源代碼

3. **用戶獲取**:
   - 實施推薦獎勵計劃
   - 與其他應用合作
   - 參加科技活動和展覽

---

🎉 **恭喜！您的 UGood 應用已準備好發布到應用商店了！**

記住，成功的應用不僅僅是技術實現，還需要持續的維護、更新和用戶支持。祝您的應用獲得成功！ 
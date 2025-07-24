# 🔥 Firebase 設置指南

## 📋 設置步驟

### 1. 創建 Firebase 項目

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊 "創建項目" 或 "Add project"
3. 輸入項目名稱：`ugood-app`
4. 選擇是否啟用 Google Analytics（建議啟用）
5. 創建項目

### 2. 添加 Web 應用

1. 在 Firebase 項目概覽中，點擊 "Web" 圖標 (`</>`)
2. 輸入應用暱稱：`UGood App`
3. **不要**勾選 "設置 Firebase Hosting"
4. 點擊 "註冊應用"

### 3. 獲取配置信息

註冊完成後，您會看到類似以下的配置代碼：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "ugood-app.firebaseapp.com",
  projectId: "ugood-app",
  storageBucket: "ugood-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 4. 更新本地配置

1. 打開 `firebase.config.js` 文件
2. 將您的實際配置信息替換示例配置：

```javascript
const firebaseConfig = {
  apiKey: "您的-api-key",
  authDomain: "您的項目.firebaseapp.com",
  projectId: "您的項目-id",
  storageBucket: "您的項目.appspot.com",
  messagingSenderId: "您的-sender-id",
  appId: "您的-app-id"
};
```

### 5. 啟用 Authentication

1. 在 Firebase Console 左側菜單中，點擊 "Authentication"
2. 點擊 "開始使用"
3. 前往 "Sign-in method" 標籤
4. 啟用 "電子郵件/密碼" 登入方式：
   - 點擊 "Email/Password"
   - 啟用第一個選項（電子郵件/密碼）
   - 點擊 "儲存"

### 6. 設置 Firestore 數據庫

1. 在 Firebase Console 左側菜單中，點擊 "Firestore Database"
2. 點擊 "建立資料庫"
3. 選擇 "以測試模式啟動"（稍後可以更改安全規則）
4. 選擇資料庫位置（建議選擇 `asia-east1` 台灣）
5. 點擊 "完成"

### 7. 配置安全規則（可選）

在 Firestore 的 "規則" 標籤中，您可以設置以下基本規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用戶只能讀寫自己的文檔
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 測試設置

完成以上步驟後：

1. 重新啟動 Expo 開發服務器：
   ```bash
   npm start
   ```

2. 在 iOS 模擬器中測試註冊功能
3. 檢查 Firebase Console 中是否出現新用戶

## 🔒 安全提醒

- ✅ **永遠不要**將 Firebase 配置信息提交到公開的 Git 倉庫
- ✅ 考慮使用環境變量來存儲敏感配置
- ✅ 在生產環境中設置適當的 Firestore 安全規則
- ✅ 定期檢查 Firebase 使用量和費用

## 📊 費用說明

- **Authentication**: 50,000 MAU 免費
- **Firestore**: 1GB 存儲 + 50K 讀取 + 20K 寫入/天 免費
- **對於 UGood 應用**: 預計在免費額度內運行

## 🛠 故障排除

### 常見錯誤：

1. **"Firebase: Error (auth/api-key-not-valid)"**
   - 檢查 `apiKey` 是否正確複製

2. **"Firebase: Error (auth/invalid-api-key)"**
   - 確認在 Firebase Console 中啟用了 Authentication

3. **網絡錯誤**
   - 檢查網絡連接
   - 確認 Firebase 項目沒有被暫停

需要幫助？請檢查 Firebase 文檔或聯繫開發者。 
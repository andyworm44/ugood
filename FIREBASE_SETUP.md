# 🔥 Firebase 設定指南

## 📋 **快速設定步驟**

### **第一步：創建 Firebase 項目**

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「**建立專案**」或「**Create a project**」
3. 輸入項目名稱：`ugood-app`
4. 選擇是否啟用 Google Analytics（建議啟用）
5. 點擊「**建立專案**」

### **第二步：添加 Web 應用**

1. 在 Firebase 項目主頁，點擊「**</>**」圖標（Web 應用）
2. 輸入應用暱稱：`UGood App`
3. **不要**勾選「設定 Firebase Hosting」
4. 點擊「**註冊應用程式**」

### **第三步：獲取配置信息**

複製顯示的配置對象，看起來像這樣：
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "ugood-app-xxxxx.firebaseapp.com",
  projectId: "ugood-app-xxxxx",
  storageBucket: "ugood-app-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### **第四步：更新配置文件**

1. 打開 `firebase.config.js` 文件
2. 將你的真實配置替換掉現有的配置：

```javascript
const firebaseConfig = {
  apiKey: "你的-api-key",
  authDomain: "你的-project.firebaseapp.com",
  projectId: "你的-project-id",
  storageBucket: "你的-project.appspot.com",
  messagingSenderId: "你的-sender-id",
  appId: "你的-app-id"
};
```

### **第五步：啟用 Authentication**

1. 在 Firebase Console 左側選單，點擊「**Authentication**」
2. 點擊「**開始使用**」
3. 前往「**Sign-in method**」標籤
4. 點擊「**電子郵件/密碼**」
5. 啟用「**電子郵件/密碼**」選項
6. 點擊「**儲存**」

### **第六步：創建 Firestore Database**

1. 在 Firebase Console 左側選單，點擊「**Firestore Database**」
2. 點擊「**建立資料庫**」
3. 選擇「**以測試模式開始**」
4. 選擇資料庫位置（建議選擇離你最近的區域）
5. 點擊「**完成**」

## 🎯 **設定完成檢查**

設定完成後，重新啟動應用：

```bash
npx expo start --clear
```

你應該會在控制台看到：
```
✅ Firebase 連接成功！
📊 項目 ID: your-project-id
```

## 🔧 **常見問題**

### **問題 1：「Permission denied」錯誤**
**解決方案**：確保 Firestore 規則設為測試模式：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 3, 1);
    }
  }
}
```

### **問題 2：「Auth domain not authorized」**
**解決方案**：
1. 前往 Firebase Console → Authentication → Settings
2. 在「授權網域」中添加你的域名

### **問題 3：配置後仍顯示模擬模式**
**檢查清單**：
- ✅ 確認 `apiKey` 不包含 "your-" 字樣
- ✅ 確認所有配置值都已正確填入
- ✅ 重新啟動應用 (`npx expo start --clear`)

## 📱 **功能對比**

| 功能 | 模擬模式 | Firebase 模式 |
|------|----------|---------------|
| 用戶註冊 | ✅ 本地模擬 | ✅ 真實註冊 |
| 用戶登入 | ✅ 本地模擬 | ✅ 真實登入 |
| 錄音功能 | ✅ 完全正常 | ✅ 完全正常 |
| 數據持久化 | ❌ 重啟消失 | ✅ 永久保存 |
| 用戶配對 | ❌ 模擬配對 | ✅ 真實配對 |
| 多設備同步 | ❌ 無法同步 | ✅ 自動同步 |

## 🚀 **下一步**

設定完成後，你可以：
1. **繼續測試**：所有功能都會正常工作
2. **邀請朋友**：真實用戶可以註冊和使用
3. **數據分析**：在 Firebase Console 查看用戶數據
4. **正式發佈**：準備提交到 App Store

---

**🎉 設定完成後，你的 UGood 應用就是一個完全功能的產品了！** 
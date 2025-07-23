# UGood App 快速設置指南

## 🚀 快速開始

### 1. 環境準備

確保您的開發環境已安裝以下工具：

- **Node.js** (v16+): [下載地址](https://nodejs.org/)
- **npm** 或 **yarn**: 隨 Node.js 一起安裝
- **Expo CLI**: 
  ```bash
  npm install -g expo-cli @expo/cli
  ```
- **EAS CLI** (用於構建和部署):
  ```bash
  npm install -g @expo/eas-cli
  ```

### 2. 項目安裝

```bash
# 安裝依賴
npm install

# 或使用 yarn
yarn install
```

### 3. Firebase 設置

#### 3.1 創建 Firebase 項目

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「創建項目」
3. 輸入項目名稱（例如：ugood-app）
4. 選擇是否啟用 Google Analytics（可選）
5. 點擊「創建項目」

#### 3.2 設置 Authentication

1. 在 Firebase 控制台中，點擊左側菜單的「Authentication」
2. 點擊「開始使用」
3. 選擇「Sign-in method」標籤
4. 啟用「電子郵件/密碼」登入方式
5. 點擊「儲存」

#### 3.3 設置 Firestore Database

1. 在 Firebase 控制台中，點擊左側菜單的「Firestore Database」
2. 點擊「創建資料庫」
3. 選擇「測試模式」（開發階段）
4. 選擇資料庫位置（建議選擇離用戶最近的位置）
5. 點擊「完成」

#### 3.4 獲取 Firebase 配置

1. 在 Firebase 控制台中，點擊項目設置（齒輪圖標）
2. 選擇「項目設置」
3. 滾動到「您的應用程式」部分
4. 點擊「Web」圖標添加 Web 應用
5. 輸入應用暱稱（例如：UGood Web）
6. 複製配置對象

#### 3.5 更新應用配置

將 Firebase 配置替換到 `App.tsx` 文件中：

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 4. 運行應用

```bash
# 啟動開發服務器
npm start

# 或
expo start
```

這將打開 Expo DevTools 在瀏覽器中。您可以：

- 在 iOS 模擬器中運行：按 `i`
- 在 Android 模擬器中運行：按 `a`
- 在實體設備上運行：掃描 QR 碼（需要安裝 Expo Go 應用）

### 5. 測試應用

1. 應用啟動後，您會看到登入畫面
2. 點擊「還沒有帳號？立即註冊」
3. 填寫註冊表單並提交
4. 註冊成功後會自動登入
5. 探索應用的各項功能

## 📱 在實體設備上測試

### iOS 設備

1. 在 App Store 下載「Expo Go」應用
2. 確保設備和開發電腦在同一網路
3. 使用 Expo Go 掃描 QR 碼

### Android 設備

1. 在 Google Play Store 下載「Expo Go」應用
2. 確保設備和開發電腦在同一網路
3. 使用 Expo Go 掃描 QR 碼

## 🏗️ 構建和部署

### 設置 EAS

```bash
# 登入 Expo 帳號
eas login

# 配置 EAS Build
eas build:configure
```

### 構建應用

```bash
# 構建 iOS 版本
eas build --platform ios

# 構建 Android 版本
eas build --platform android

# 同時構建兩個平台
eas build --platform all
```

### 提交到應用商店

```bash
# 提交到 App Store
eas submit --platform ios

# 提交到 Google Play Store
eas submit --platform android
```

## 🔧 常見問題

### Q: 遇到 "Module not found" 錯誤怎麼辦？

A: 嘗試以下步驟：
```bash
# 清除 npm 快取
npm cache clean --force

# 刪除 node_modules 和重新安裝
rm -rf node_modules
npm install

# 重新啟動 Expo
expo start --clear
```

### Q: Firebase 連接失敗怎麼辦？

A: 檢查以下項目：
1. Firebase 配置是否正確
2. Firebase 項目是否啟用了 Authentication 和 Firestore
3. 網路連接是否正常
4. Firebase 安全規則是否允許讀寫

### Q: iOS 構建失敗怎麼辦？

A: 常見解決方案：
1. 確保有有效的 Apple Developer 帳號
2. 檢查 Bundle ID 是否唯一
3. 更新 Expo CLI 到最新版本
4. 檢查 EAS 構建日誌獲取詳細錯誤信息

### Q: 如何更新應用版本？

A: 更新以下文件：
1. `package.json` 中的 `version`
2. `app.json` 中的 `expo.version`
3. iOS: `expo.ios.buildNumber`
4. Android: `expo.android.versionCode`

## 📚 進一步學習

- [Expo 文檔](https://docs.expo.dev/)
- [React Native 文檔](https://reactnative.dev/)
- [Firebase 文檔](https://firebase.google.com/docs)
- [React Navigation 文檔](https://reactnavigation.org/)
- [React Native Paper 文檔](https://reactnativepaper.com/)

## 💡 開發提示

1. **使用 TypeScript**: 項目已配置 TypeScript，充分利用類型安全
2. **組件重用**: 創建可重用的組件以提高開發效率
3. **錯誤處理**: 總是處理可能的錯誤情況
4. **性能優化**: 使用 React.memo 和 useMemo 優化性能
5. **測試**: 編寫單元測試和集成測試
6. **代碼格式**: 使用 Prettier 和 ESLint 保持代碼一致性

## 🤝 獲取幫助

如果遇到問題，可以：

1. 查看 [GitHub Issues](../../issues)
2. 參考官方文檔
3. 在開發者社區尋求幫助
4. 聯絡開發團隊

---

祝您開發愉快！🎉 
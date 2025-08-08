# 🗄️ Supabase Storage 設置指南

## 📋 前置要求

在使用音頻上傳功能之前，您需要在 Supabase 中設置 Storage bucket。

## 🚀 設置步驟

### 1. 登入 Supabase Dashboard

1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 選擇您的 UGood 項目

### 2. 創建 Storage Bucket

1. 在左側導航欄點擊 **"Storage"**
2. 點擊 **"Create a new bucket"** 或 **"New Bucket"**
3. 填寫以下信息：
   - **Bucket name**: `audio-files`
   - **Public bucket**: ✅ **啟用** (勾選此選項讓音頻文件可公開訪問)
4. 點擊 **"Create bucket"**

### 3. 設置 Bucket 政策 (RLS)

因為我們啟用了公開訪問，但仍需要設置適當的安全規則：

1. 點擊剛創建的 `audio-files` bucket
2. 前往 **"Policies"** 標籤
3. 點擊 **"New Policy"**

#### 允許認證用戶上傳政策

```sql
-- 政策名稱: "Authenticated users can upload"
-- 操作: INSERT
-- 目標角色: authenticated

-- 政策表達式:
bucket_id = 'audio-files' AND auth.role() = 'authenticated'
```

#### 允許公開讀取政策

```sql
-- 政策名稱: "Public can download"
-- 操作: SELECT
-- 目標角色: public

-- 政策表達式:
bucket_id = 'audio-files'
```

### 4. 設置文件大小限制 (可選)

在 **"Settings"** 標籤中，您可以設置：
- **File size limit**: 建議設為 `50MB` (音頻文件通常不會超過此大小)
- **Allowed MIME types**: `audio/*` (僅允許音頻文件)

## 🧪 測試設置

### 使用 Supabase CLI 測試 (可選)

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入
supabase login

# 測試上傳
supabase storage upload audio-files test.mp3 /path/to/test.mp3
```

### 在應用中測試

1. 啟動您的 UGood 應用
2. 註冊/登入帳號
3. 前往錄音頁面
4. 錄製一段短音頻
5. 點擊 **"發送祝福語音"**
6. 檢查控制台是否有上傳成功的日誌

## 📊 監控與管理

### 查看上傳的文件

在 Supabase Dashboard 的 Storage 部分，您可以：
- 查看所有上傳的音頻文件
- 監控存儲使用量
- 管理文件（下載、刪除等）

### 文件命名規範

應用會自動生成唯一的文件名：
```
blessing_{user_id}_{timestamp}_{random_id}.m4a
```

例如：`blessing_abc123_1703947935_x7y9z.m4a`

## 🔧 故障排除

### 常見問題

#### 1. 上傳失敗 - 權限錯誤
**錯誤**: `new row violates row-level security policy`

**解決方案**:
- 確認您已設置正確的 RLS 政策
- 檢查用戶是否已認證

#### 2. 文件無法訪問
**錯誤**: `The resource you are looking for could not be found`

**解決方案**:
- 確認 bucket 已設為 public
- 檢查文件是否確實上傳成功

#### 3. 文件大小過大
**錯誤**: `Payload too large`

**解決方案**:
- 檢查文件大小限制設置
- 考慮壓縮音頻文件

### 檢查配置

確認您的 `supabase.config.js` 中的設置正確：

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
```

## 📈 擴展功能

### 音頻文件處理

您可以考慮添加：
- 音頻壓縮
- 格式轉換
- 音質優化
- 自動轉錄

### 安全增強

- 設置文件掃毒
- 內容審核
- 速率限制
- 用戶配額管理

---

## ✅ 完成檢查清單

- [ ] 創建 `audio-files` bucket
- [ ] 設置為公開 bucket
- [ ] 配置上傳權限政策
- [ ] 配置讀取權限政策
- [ ] 設置文件大小限制
- [ ] 測試上傳功能
- [ ] 測試播放功能
- [ ] 檢查文件能正常訪問

完成以上步驟後，您的 UGood 應用就能完整地支持音頻上傳和播放功能了！🎉
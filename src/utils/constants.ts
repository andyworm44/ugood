// 應用配置常量
export const APP_CONFIG = {
  NAME: 'UGood',
  VERSION: '1.0.0',
  DESCRIPTION: '一個簡潔優雅的社交應用',
};

// 顏色主題
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#0056CC',
  SUCCESS: '#34C759',
  ERROR: '#FF3B30',
  WARNING: '#FF9500',
  INFO: '#5AC8FA',
  LIGHT: '#F2F2F7',
  DARK: '#1C1C1E',
  GRAY: '#8E8E93',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
};

// 間距
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 40,
};

// 字體大小
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

// 邊框半徑
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 50,
};

// Firebase 集合名稱
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  NOTIFICATIONS: 'notifications',
};

// 路由名稱
export const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  POST_DETAIL: 'PostDetail',
  CREATE_POST: 'CreatePost',
  EDIT_PROFILE: 'EditProfile',
};

// 錯誤訊息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '網路連接失敗，請檢查您的網路連接',
  AUTH_ERROR: '認證失敗，請重新登入',
  PERMISSION_DENIED: '權限不足，無法執行此操作',
  NOT_FOUND: '找不到請求的資源',
  VALIDATION_ERROR: '輸入資料格式不正確',
  UNKNOWN_ERROR: '發生未知錯誤，請稍後再試',
};

// 成功訊息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登入成功',
  REGISTER_SUCCESS: '註冊成功',
  POST_CREATED: '貼文發布成功',
  POST_UPDATED: '貼文更新成功',
  POST_DELETED: '貼文刪除成功',
  PROFILE_UPDATED: '個人資料更新成功',
};

// 驗證規則
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  POST_TITLE_MAX_LENGTH: 100,
  POST_CONTENT_MAX_LENGTH: 1000,
};

// 分頁設定
export const PAGINATION = {
  POSTS_PER_PAGE: 10,
  COMMENTS_PER_PAGE: 20,
  USERS_PER_PAGE: 50,
};

// 時間格式
export const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm',
  DISPLAY: 'MM/DD HH:mm',
}; 
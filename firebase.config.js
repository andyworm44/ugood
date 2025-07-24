import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase 配置 - 測試配置（請替換為您的實際配置）
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForTesting123456789",
  authDomain: "ugood-demo.firebaseapp.com",
  projectId: "ugood-demo",
  storageBucket: "ugood-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo123456789"
};

// 檢查是否為有效配置
const isValidConfig = firebaseConfig.apiKey !== "your-api-key" && 
                     firebaseConfig.apiKey !== "AIzaSyDemoKeyForTesting123456789";

let app, auth, db;

if (isValidConfig) {
  // 使用真實的 Firebase 配置
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // 創建模擬的認證對象
    auth = createMockAuth();
    db = null;
  }
} else {
  // 創建模擬的認證對象用於開發測試
  console.warn('使用模擬 Firebase 配置 - 請在 firebase.config.js 中設置真實的 Firebase 配置');
  auth = createMockAuth();
  db = null;
}

// 創建模擬認證對象
function createMockAuth() {
  return {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // 模擬未登入狀態
      setTimeout(() => callback(null), 100);
      return () => {}; // 返回 unsubscribe 函數
    }
  };
}

export { auth, db };
export default app; 
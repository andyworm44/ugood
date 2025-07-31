import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 用戶的真實 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBW5Jsqv06ig1INsV_2LNHynVcUHGIb-OY",
  authDomain: "ugood-c7121.firebaseapp.com",
  projectId: "ugood-c7121",
  storageBucket: "ugood-c7121.firebasestorage.app",
  messagingSenderId: "675421851928",
  appId: "1:675421851928:web:acc3ab2571165714764e6d",
  measurementId: "G-4GX3ZX14PT"
};

console.log('🔥 開始初始化 Firebase Web SDK (增強版)...');

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let isFirebaseAvailable = false;

try {
  // 檢查必要的 Firebase 配置
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Missing Firebase configuration');
  }

  console.log('📋 Firebase 配置檢查通過');

  // 初始化 Firebase App
  firebaseApp = initializeApp(firebaseConfig);
  console.log('✅ Firebase App 初始化成功');

  // 初始化 Auth (嘗試使用 AsyncStorage 持久化)
  try {
    firebaseAuth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('✅ Firebase Auth 初始化成功 (使用 AsyncStorage 持久化)');
  } catch (authError) {
    console.log('⚠️ AsyncStorage 持久化失敗，使用預設 Auth');
    firebaseAuth = getAuth(firebaseApp);
    console.log('✅ Firebase Auth 初始化成功 (預設模式)');
  }

  // 初始化 Firestore
  firebaseDb = getFirestore(firebaseApp);
  console.log('✅ Firestore 初始化成功');

  isFirebaseAvailable = true;
  console.log('🎉 Firebase Web SDK 完全初始化成功！');

} catch (error) {
  console.error('❌ Firebase Web SDK 初始化失敗:', error.message);
  console.error('❌ 錯誤詳情:', error);

  // 設置為 null 以確保後續檢查正確
  firebaseApp = null;
  firebaseAuth = null;
  firebaseDb = null;
  isFirebaseAvailable = false;

  console.log('🔄 將使用模擬模式');
}

// 導出 Firebase 實例
export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firebaseDb;

// 為了兼容性
export { firebaseApp, firebaseAuth, firebaseDb, isFirebaseAvailable };

console.log('🎯 Firebase Web SDK 配置完成！', {
  available: isFirebaseAvailable,
  hasApp: !!firebaseApp,
  hasAuth: !!firebaseAuth,
  hasDb: !!firebaseDb
}); 
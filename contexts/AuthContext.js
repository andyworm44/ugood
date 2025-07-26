import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, getFirestore } from '../firebase.config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  console.log('🔍 AuthContext 初始化...');

  // 模擬用戶數據存儲
  const mockUsers = {};

  // 註冊新用戶
  async function signup(email, password, additionalInfo = {}) {
    try {
      if (!firebaseReady) {
        // 模擬模式
        console.log('🔄 模擬註冊:', { email, additionalInfo });

        // 檢查用戶是否已存在
        if (mockUsers[email]) {
          throw { code: 'auth/email-already-in-use' };
        }

        // 模擬創建用戶
        const mockUser = {
          uid: `mock-${Date.now()}`,
          email: email,
          displayName: additionalInfo.displayName || '',
          ...additionalInfo
        };

        mockUsers[email] = { password, ...mockUser };
        setCurrentUser(mockUser);

        return { user: mockUser };
      } else {
        // 真實 Firebase 模式
        console.log('🔥 Firebase 註冊:', { email, additionalInfo });
        
        const auth = await getAuth();
        const db = await getFirestore();
        
        if (!auth) {
          throw new Error('Firebase Auth 不可用');
        }

        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // 更新用戶資料
        if (additionalInfo.displayName) {
          await updateProfile(user, {
            displayName: additionalInfo.displayName
          });
        }

        // 在 Firestore 中創建用戶文檔
        if (db) {
          const { doc, setDoc } = await import('firebase/firestore');
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: additionalInfo.displayName || '',
            gender: additionalInfo.gender || '',
            age: additionalInfo.age || '',
            createdAt: new Date().toISOString()
          });
        }

        console.log('✅ Firebase 註冊成功:', user.uid);
        return result;
      }
    } catch (error) {
      console.error('❌ 註冊失敗:', error);
      throw error;
    }
  }

  // 用戶登入
  async function login(email, password) {
    if (!firebaseReady) {
      // 模擬登入
      console.log('🔄 模擬登入:', { email });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = mockUsers[email];
          if (user && user.password === password) {
            setCurrentUser(user);
            resolve({ user });
          } else if (!user) {
            reject({ code: 'auth/user-not-found' });
          } else {
            reject({ code: 'auth/wrong-password' });
          }
        }, 500);
      });
    } else {
      console.log('🔥 Firebase 登入:', { email });
      const auth = await getAuth();
      if (!auth) {
        throw new Error('Firebase Auth 不可用');
      }
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      return signInWithEmailAndPassword(auth, email, password);
    }
  }

  // 用戶登出
  async function logout() {
    if (!firebaseReady) {
      console.log('🔄 模擬登出');
      return new Promise((resolve) => {
        setCurrentUser(null);
        resolve();
      });
    } else {
      console.log('🔥 Firebase 登出');
      const auth = await getAuth();
      if (!auth) {
        throw new Error('Firebase Auth 不可用');
      }
      const { signOut } = await import('firebase/auth');
      return signOut(auth);
    }
  }

  // 獲取用戶額外資料
  async function getUserData(uid) {
    if (!firebaseReady) {
      return null;
    }

    try {
      const db = await getFirestore();
      if (!db) return null;

      const { doc, getDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  useEffect(() => {
    async function initializeFirebase() {
      console.log('🔄 嘗試初始化 Firebase...');
      
      try {
        const auth = await getAuth();
        if (auth) {
          console.log('✅ Firebase Auth 可用！');
          setFirebaseReady(true);

          // 設置 Auth 狀態監聽器
          const { onAuthStateChanged } = await import('firebase/auth');
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('🔄 Auth 狀態變化:', user ? user.uid : 'null');

            if (user) {
              // 獲取用戶額外資料
              const userData = await getUserData(user.uid);
              setCurrentUser({
                ...user,
                ...userData
              });
            } else {
              setCurrentUser(null);
            }
            setLoading(false);
          });

          return unsubscribe;
        } else {
          throw new Error('Firebase Auth 初始化失敗');
        }
      } catch (error) {
        console.log('⚠️ Firebase 不可用，使用模擬模式:', error.message);
        setFirebaseReady(false);
        setLoading(false);
      }
    }

    initializeFirebase();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData,
    isMockMode: !firebaseReady
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 
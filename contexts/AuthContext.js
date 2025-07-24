import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 檢查是否為模擬模式
  const isMockMode = !auth.createUserWithEmailAndPassword;

  // 模擬用戶數據存儲
  const mockUsers = {};

  // 註冊新用戶
  async function signup(email, password, additionalInfo = {}) {
    try {
      if (isMockMode) {
        // 模擬模式
        console.log('模擬註冊:', { email, additionalInfo });
        
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
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: additionalInfo.displayName || '',
            gender: additionalInfo.gender || '',
            age: additionalInfo.age || '',
            createdAt: new Date().toISOString()
          });
        }

        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  // 用戶登入
  function login(email, password) {
    if (isMockMode) {
      // 模擬登入
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
      return signInWithEmailAndPassword(auth, email, password);
    }
  }

  // 用戶登出
  function logout() {
    if (isMockMode) {
      return new Promise((resolve) => {
        setCurrentUser(null);
        resolve();
      });
    } else {
      return signOut(auth);
    }
  }

  // 獲取用戶額外資料
  async function getUserData(uid) {
    if (isMockMode) {
      return null;
    }

    try {
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
    if (isMockMode) {
      // 模擬模式下直接設置為未登入
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData,
    isMockMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { auth, db, isFirebaseAvailable } from '../firebase.config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🔥 AuthContext 初始化 (Web SDK 增強版)...', {
    firebaseAvailable: isFirebaseAvailable,
    authInstance: !!auth,
    dbInstance: !!db
  });

  // 真實註冊功能
  async function signup(email, password, additionalInfo = {}) {
    console.log('🔥 開始註冊流程...', {
      email,
      isFirebaseAvailable,
      hasAuth: !!auth,
      hasDb: !!db
    });

    // 如果 Firebase 不可用，自動使用模擬模式
    if (!isFirebaseAvailable || !auth || !db) {
      console.log('⚠️ Firebase 不可用，使用模擬註冊');

      // 模擬註冊流程
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        uid: 'mock-user-' + Date.now(),
        email: email,
        displayName: additionalInfo.displayName || '',
        ...additionalInfo
      };
      setCurrentUser(mockUser);
      console.log('✅ 模擬註冊成功');
      return { user: mockUser };
    }

    try {
      console.log('🔥 使用 Firebase Web SDK 註冊');
      console.log('🔥 Firebase 實例狀態:', {
        authInstance: !!auth,
        dbInstance: !!db,
        projectId: db?.app?.options?.projectId
      });

      // 創建用戶帳號
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ 用戶帳號創建成功:', {
        uid: user.uid,
        email: user.email,
        projectId: auth?.app?.options?.projectId
      });

      // 將額外信息存儲到 Firestore
      const userDoc = {
        email: email,
        displayName: additionalInfo.displayName || '',
        age: additionalInfo.age || '',
        gender: additionalInfo.gender || '',
        createdAt: new Date().toISOString(),
        uid: user.uid
      };

      console.log('📊 準備寫入 Firestore:', userDoc);

      await setDoc(doc(db, 'users', user.uid), userDoc);
      console.log('✅ 用戶資料已存儲到 Firestore');
      console.log('🎯 請檢查 Firebase Console > Firestore Database > users 集合');

      return { user };
    } catch (error) {
      console.error('❌ Firebase Web SDK 註冊失敗:', error);
      console.error('❌ 錯誤詳情:', {
        code: error.code,
        message: error.message
      });

      // 如果是網路或 Firebase 服務問題，降級到模擬模式
      if (error.code === 'auth/network-request-failed' ||
          error.code === 'auth/internal-error' ||
          error.message.includes('Firebase')) {
        console.log('🔄 降級到模擬註冊模式');

        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          uid: 'mock-user-' + Date.now(),
          email: email,
          displayName: additionalInfo.displayName || '',
          ...additionalInfo
        };
        setCurrentUser(mockUser);
        console.log('✅ 降級模擬註冊成功');
        return { user: mockUser };
      }

      throw error;
    }
  }

  // 真實登入功能
  async function login(email, password) {
    if (!isFirebaseAvailable || !auth) {
      console.log('⚠️ Firebase 不可用，使用模擬登入');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        uid: 'mock-user-login',
        email: email,
        displayName: 'Test User'
      };
      setCurrentUser(mockUser);
      console.log('✅ 模擬登入成功');
      return { user: mockUser };
    }

    try {
      console.log('🔥 開始真實登入:', { email });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ 登入成功:', userCredential.user.uid);
      return { user: userCredential.user };
    } catch (error) {
      console.error('❌ 登入失敗:', error);
      throw error;
    }
  }

  // 真實登出功能
  async function logout() {
    if (!isFirebaseAvailable || !auth) {
      console.log('🎮 模擬登出');
      setCurrentUser(null);
      return;
    }

    try {
      console.log('🔥 開始登出');
      await signOut(auth);
      console.log('✅ 登出成功');
    } catch (error) {
      console.error('❌ 登出失敗:', error);
      throw error;
    }
  }

  // 獲取用戶額外資料
  async function getUserData(uid) {
    if (!isFirebaseAvailable || !db) {
      return { displayName: '', age: '', gender: '' };
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return { displayName: '', age: '', gender: '' };
    } catch (error) {
      console.error('❌ 獲取用戶資料失敗:', error);
      return { displayName: '', age: '', gender: '' };
    }
  }

  // 真實分享困擾功能
  async function shareTrouble(content) {
    if (!isFirebaseAvailable || !db || !currentUser) {
      console.log('🎮 模擬分享困擾:', content);
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ 模擬分享成功');
      return { id: 'mock-trouble-' + Date.now(), content };
    }

    try {
      console.log('🔥 分享困擾到 Firestore:', content);
      const troubleDoc = {
        content: content,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        status: 'waiting'
      };

      const docRef = await addDoc(collection(db, 'troubles'), troubleDoc);
      console.log('✅ 困擾已存儲到 Firestore:', docRef.id);

      return { id: docRef.id, content };
    } catch (error) {
      console.error('❌ 分享困擾失敗:', error);
      throw error;
    }
  }

  // 真實尋找配對功能
  async function findMatch(troubleId, currentUserId) {
    if (!isFirebaseAvailable || !db) {
      console.log('🎮 模擬配對');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ 模擬配對成功');
      return { id: 'mock-match-' + Date.now() };
    }

    try {
      console.log('🔥 尋找配對中...');

      // 查找其他等待配對的困擾
      const q = query(
        collection(db, 'troubles'),
        where('status', '==', 'waiting'),
        where('userId', '!=', currentUserId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 找到配對，創建 match 記錄
        const matchedTrouble = querySnapshot.docs[0];
        const matchDoc = {
          troubleId1: troubleId,
          troubleId2: matchedTrouble.id,
          user1: currentUserId,
          user2: matchedTrouble.data().userId,
          createdAt: new Date().toISOString(),
          status: 'active'
        };

        const matchRef = await addDoc(collection(db, 'matches'), matchDoc);

        // 更新兩個困擾的狀態
        await updateDoc(doc(db, 'troubles', troubleId), { status: 'matched' });
        await updateDoc(doc(db, 'troubles', matchedTrouble.id), { status: 'matched' });

        console.log('✅ 配對成功:', matchRef.id);
        return { id: matchRef.id };
      } else {
        console.log('⏳ 暫時沒有可配對的對象');
        return null;
      }
    } catch (error) {
      console.error('❌ 配對失敗:', error);
      throw error;
    }
  }

  // 獲取我的當前配對
  async function getMyCurrentMatch() {
    if (!isFirebaseAvailable || !db || !currentUser) {
      console.log('🎮 模擬獲取配對');
      if (Math.random() > 0.5) {
        return {
          type: 'helping',
          match: { id: 'mock-match', helperId: 'mock-helper' },
          trouble: { id: 'mock-trouble', content: '我今天心情不太好...' }
        };
      }
      return null;
    }

    try {
      const q = query(
        collection(db, 'matches'),
        where('status', '==', 'active')
      );

      const querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        const matchData = doc.data();
        if (matchData.user1 === currentUser.uid || matchData.user2 === currentUser.uid) {
          // 找到我的配對
          const isHelper = matchData.user2 === currentUser.uid;
          const troubleId = isHelper ? matchData.troubleId1 : matchData.troubleId2;

          const troubleDoc = await getDoc(doc(db, 'troubles', troubleId));

          return {
            type: isHelper ? 'helping' : 'sharing',
            match: { id: doc.id, helperId: matchData.user2 },
            trouble: { id: troubleId, content: troubleDoc.data()?.content || '' }
          };
        }
      }

      return null;
    } catch (error) {
      console.error('❌ 獲取配對失敗:', error);
      return null;
    }
  }

  // 監聽認證狀態變化
  useEffect(() => {
    if (!isFirebaseAvailable || !auth) {
      console.log('⚠️ Firebase 不可用，跳過認證監聽器');
      setLoading(false);
      return;
    }

    console.log('🔥 設置 Firebase Auth 監聽器');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 認證狀態變化:', user ? user.uid : 'null');
      setCurrentUser(user);
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
    shareTrouble,
    findMatch,
    getMyCurrentMatch,
    isMockMode: !isFirebaseAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 
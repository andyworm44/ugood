import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../../App';

// 用戶相關操作
export const userService = {
  // 創建用戶資料
  async createUser(uid: string, userData: any) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    }
  },

  // 獲取用戶資料
  async getUser(uid: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error };
    }
  },

  // 更新用戶資料
  async updateUser(uid: string, updates: any) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error };
    }
  }
};

// 貼文相關操作
export const postService = {
  // 創建貼文
  async createPost(postData: any) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        authorId: user.uid,
        authorName: user.displayName || '匿名用戶',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        likes: 0,
        comments: []
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error };
    }
  },

  // 獲取貼文列表
  async getPosts(limitCount: number = 20) {
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const posts: any[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return { success: true, data: posts };
    } catch (error) {
      console.error('Error getting posts:', error);
      return { success: false, error };
    }
  },

  // 監聽貼文變化
  subscribeToPosts(callback: (posts: any[]) => void, limitCount: number = 20) {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (querySnapshot) => {
      const posts: any[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(posts);
    });
  },

  // 更新貼文
  async updatePost(postId: string, updates: any) {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error };
    }
  },

  // 刪除貼文
  async deletePost(postId: string) {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error };
    }
  }
};

// 通用工具函數
export const utils = {
  // 時間戳轉換
  timestampToDate: (timestamp: any) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  },

  // 格式化日期
  formatDate: (date: Date) => {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}; 
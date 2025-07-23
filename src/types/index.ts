// 用戶相關類型
export interface User {
  uid: string;
  name: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

// 貼文相關類型
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
  imageUrl?: string;
}

// 評論相關類型
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

// 導航相關類型
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

// API 響應類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

// 表單相關類型
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PostForm {
  title: string;
  content: string;
}

// 設定相關類型
export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  locationSharing: boolean;
  language: 'zh-TW' | 'en-US';
} 
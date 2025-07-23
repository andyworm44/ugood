import { VALIDATION } from './constants';

// 驗證電子郵件格式
export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

// 驗證密碼強度
export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

// 驗證姓名
export const validateName = (name: string): boolean => {
  return name.trim().length >= VALIDATION.NAME_MIN_LENGTH;
};

// 驗證貼文標題
export const validatePostTitle = (title: string): boolean => {
  const trimmedTitle = title.trim();
  return trimmedTitle.length > 0 && trimmedTitle.length <= VALIDATION.POST_TITLE_MAX_LENGTH;
};

// 驗證貼文內容
export const validatePostContent = (content: string): boolean => {
  const trimmedContent = content.trim();
  return trimmedContent.length > 0 && trimmedContent.length <= VALIDATION.POST_CONTENT_MAX_LENGTH;
};

// 驗證登入表單
export const validateLoginForm = (email: string, password: string) => {
  const errors: string[] = [];

  if (!email.trim()) {
    errors.push('請輸入電子郵件');
  } else if (!validateEmail(email)) {
    errors.push('請輸入有效的電子郵件格式');
  }

  if (!password.trim()) {
    errors.push('請輸入密碼');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 驗證註冊表單
export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const errors: string[] = [];

  if (!name.trim()) {
    errors.push('請輸入姓名');
  } else if (!validateName(name)) {
    errors.push(`姓名至少需要${VALIDATION.NAME_MIN_LENGTH}個字符`);
  }

  if (!email.trim()) {
    errors.push('請輸入電子郵件');
  } else if (!validateEmail(email)) {
    errors.push('請輸入有效的電子郵件格式');
  }

  if (!password.trim()) {
    errors.push('請輸入密碼');
  } else if (!validatePassword(password)) {
    errors.push(`密碼至少需要${VALIDATION.PASSWORD_MIN_LENGTH}個字符`);
  }

  if (!confirmPassword.trim()) {
    errors.push('請確認密碼');
  } else if (password !== confirmPassword) {
    errors.push('密碼確認不符');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 驗證貼文表單
export const validatePostForm = (title: string, content: string) => {
  const errors: string[] = [];

  if (!title.trim()) {
    errors.push('請輸入貼文標題');
  } else if (!validatePostTitle(title)) {
    errors.push(`標題長度不能超過${VALIDATION.POST_TITLE_MAX_LENGTH}個字符`);
  }

  if (!content.trim()) {
    errors.push('請輸入貼文內容');
  } else if (!validatePostContent(content)) {
    errors.push(`內容長度不能超過${VALIDATION.POST_CONTENT_MAX_LENGTH}個字符`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 清理輸入文字
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

// 檢查字符串是否為空或只包含空白字符
export const isEmpty = (str: string): boolean => {
  return !str || !str.trim();
}; 
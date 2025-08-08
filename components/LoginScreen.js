import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../contexts/SupabaseAuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('錯誤', '請填寫所有欄位');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('錯誤', '請輸入有效的電子郵件地址');
      return;
    }

    setLoading(true);
    try {
      console.log('🔑 開始登入嘗試:', { email: email.trim() });
      await login(email.trim().toLowerCase(), password);
      console.log('✅ 登入成功，準備導航到主頁');
      // 不顯示 Alert，讓 AuthContext 的狀態變化自動處理導航
    } catch (error) {
      console.error('❌ Login error:', error);
      let errorMessage = '登入失敗，請稍後再試';
      
      // 處理 Supabase 特定錯誤
      if (error.message && error.message.includes('Invalid login credentials')) {
        Alert.alert('登入失敗', '密碼錯誤，請重新輸入', [{ text: '確定' }]);
        return;
      } else if (error.message && error.message.includes('Email not confirmed')) {
        errorMessage = '郵箱未驗證，請檢查郵箱或聯繫管理員';
      } else if (error.message && error.message.includes('Too Many Requests')) {
        errorMessage = '登入嘗試過於頻繁，請等待 2-3 分鐘後再試';
      } else {
        // 處理舊的 Firebase 錯誤碼（如果存在）
        switch (error.code) {
          case 'auth/user-not-found':
            Alert.alert(
              '帳號不存在', 
              '此電子郵件尚未註冊，是否要建立新帳號？',
              [
                { text: '取消', style: 'cancel' },
                { 
                  text: '註冊新帳號', 
                  onPress: () => navigation.navigate('Register')
                }
              ]
            );
            return;
          case 'auth/wrong-password':
            errorMessage = '密碼錯誤，請重新輸入';
            break;
          case 'auth/invalid-email':
            errorMessage = '無效的電子郵件格式';
            break;
          case 'auth/user-disabled':
            errorMessage = '此帳號已被停用';
            break;
          case 'auth/too-many-requests':
            errorMessage = '登入嘗試次數過多，請稍後再試';
            break;
          default:
            errorMessage = error.message || '登入失敗';
        }
      }
      
      Alert.alert('登入失敗', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 快速測試功能
  const handleQuickTest = () => {
    Alert.alert(
      '快速測試', 
      '在模擬模式下，您可以使用任意有效的電子郵件和密碼進行測試\n\n建議：先註冊一個帳號，然後再測試登入功能',
      [
        { text: '了解', style: 'cancel' },
        { 
          text: '去註冊', 
          onPress: () => navigation.navigate('Register')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>歡迎回來</Text>
          <Text style={styles.headerSubtitle}>登入您的 UGood 帳號</Text>
        </View>
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>電子郵件</Text>
              <TextInput
                mode="outlined"
                placeholder="請輸入電子郵件"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                theme={{ 
                  colors: { 
                    primary: '#8FBC8F',
                    onSurface: '#000000',
                    onSurfaceVariant: '#000000'
                  } 
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>密碼</Text>
              <TextInput
                mode="outlined"
                placeholder="請輸入密碼"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                theme={{ 
                  colors: { 
                    primary: '#8FBC8F',
                    onSurface: '#000000',
                    onSurfaceVariant: '#000000'
                  } 
                }}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? '登入中...' : '登入'}
              </Text>
            </TouchableOpacity>

            {/* 測試提示區域 */}
            <View style={styles.testHint}>
              <Text style={styles.testHintTitle}>💡 測試提示</Text>
              <Text style={styles.testHintText}>
                如果您是第一次使用，請先註冊帳號
              </Text>
              <TouchableOpacity 
                style={styles.testButton}
                onPress={handleQuickTest}
              >
                <Text style={styles.testButtonText}>測試說明</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerLinkText}>
                還沒有帳號？ <Text style={styles.registerLinkHighlight}>立即註冊</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#8FBC8F',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
  },
  loginButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  testHint: {
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8FBC8F',
  },
  testHintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  testHintText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
  },
  registerLinkText: {
    fontSize: 16,
    color: '#666',
  },
  registerLinkHighlight: {
    color: '#8FBC8F',
    fontWeight: 'bold',
  },
}); 
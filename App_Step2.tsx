import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

type Screen = 'welcome' | 'register' | 'login' | 'home';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  console.log('🎯 UGood Step 2 - 導航系統，當前頁面:', currentScreen);

  // 歡迎頁面
  const WelcomeScreen = () => (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>UGood?</Text>
        <Text style={styles.subtitle}>分享困擾，收穫溫暖</Text>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.description}>在這裡，您可以匿名分享生活中的困擾，</Text>
        <Text style={styles.description}>並收到來自陌生朋友的溫暖祝福語音。</Text>
        <Text style={styles.description}>同時，您也可以為他人送上關懷與支持。</Text>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => setCurrentScreen('register')}
        >
          <Text style={styles.primaryButtonText}>開始使用</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => setCurrentScreen('login')}
        >
          <Text style={styles.secondaryButtonText}>已有帳號</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🔒 完全匿名 · 安全私密</Text>
      </View>
    </View>
  );

  // 註冊頁面
  const RegisterScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('welcome')}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>註冊帳號</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formTitle}>建立您的匿名帳號</Text>
        
        <TextInput
          style={styles.input}
          placeholder="暱稱（其他用戶看不到）"
          value={nickname}
          onChangeText={setNickname}
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder="電子郵件"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder="密碼"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => {
            console.log('註冊:', { nickname, email, password });
            Alert.alert('註冊成功！', '歡迎來到 UGood！', [
              { text: '確定', onPress: () => setCurrentScreen('home') }
            ]);
          }}
        >
          <Text style={styles.primaryButtonText}>註冊</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 登錄頁面
  const LoginScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('welcome')}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>登錄</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formTitle}>歡迎回來</Text>
        
        <TextInput
          style={styles.input}
          placeholder="電子郵件"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder="密碼"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => {
            console.log('登錄:', { email, password });
            Alert.alert('登錄成功！', '歡迎回到 UGood！', [
              { text: '確定', onPress: () => setCurrentScreen('home') }
            ]);
          }}
        >
          <Text style={styles.primaryButtonText}>登錄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 簡單的主頁面
  const HomeScreen = () => (
    <View style={styles.container}>
      <View style={styles.homeHeader}>
        <Text style={styles.homeTitle}>🌟 歡迎來到 UGood</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            setEmail('');
            setPassword('');
            setNickname('');
            setCurrentScreen('welcome');
          }}
        >
          <Text style={styles.logoutButtonText}>登出</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeContent}>
        <Text style={styles.homeMessage}>🎉 恭喜！您已成功進入 UGood</Text>
        <Text style={styles.homeSubMessage}>接下來我們會逐步添加核心功能：</Text>
        
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>📝 分享今日困擾</Text>
          <Text style={styles.featureItem}>🎯 尋找溫暖配對</Text>
          <Text style={styles.featureItem}>🎤 聆聽祝福語音</Text>
          <Text style={styles.featureItem}>💝 給予他人關懷</Text>
        </View>
      </View>
    </View>
  );

  // 根據當前頁面渲染不同組件
  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'register':
      return <RegisterScreen />;
    case 'login':
      return <LoginScreen />;
    case 'home':
      return <HomeScreen />;
    default:
      return <WelcomeScreen />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  // 歡迎頁面樣式
  titleSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  descriptionSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  buttonSection: {
    gap: 15,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  // 表單頁面樣式
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // 主頁面樣式
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  homeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeMessage: {
    fontSize: 20,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  homeSubMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  featureList: {
    alignItems: 'center',
    gap: 15,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

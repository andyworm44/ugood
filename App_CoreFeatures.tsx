import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Screen = 'welcome' | 'register' | 'login' | 'home' | 'shareTrouble' | 'todayMatch' | 'listenBlessing';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // 困擾相關狀態
  const [todayTrouble, setTodayTrouble] = useState('');
  const [hasSharedTrouble, setHasSharedTrouble] = useState(false);
  
  // 配對相關狀態
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [matchStatus, setMatchStatus] = useState<'none' | 'waiting' | 'matched'>('none');

  console.log('🎯 UGood 核心功能版本 - 當前頁面:', currentScreen, '用戶:', !!currentUser);

  // 載入用戶狀態
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('ugood_user');
      const troubleData = await AsyncStorage.getItem('ugood_trouble');
      
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setCurrentScreen('home');
      }
      
      if (troubleData) {
        setTodayTrouble(troubleData);
        setHasSharedTrouble(true);
        setMatchStatus('waiting');
      }
    } catch (error) {
      console.error('載入用戶數據失敗:', error);
    }
  };

  // 處理註冊
  const handleRegister = async () => {
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      Alert.alert('錯誤', '請填寫所有欄位');
      return;
    }

    const user = { email, nickname };
    await AsyncStorage.setItem('ugood_user', JSON.stringify(user));
    setCurrentUser(user);
    
    Alert.alert('註冊成功！', '歡迎來到 UGood！', [
      { text: '確定', onPress: () => setCurrentScreen('home') }
    ]);
    
    // 清空表單
    setEmail('');
    setPassword('');
    setNickname('');
  };

  // 處理登錄
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('錯誤', '請填寫郵箱和密碼');
      return;
    }

    const user = { email, nickname: email.split('@')[0] };
    await AsyncStorage.setItem('ugood_user', JSON.stringify(user));
    setCurrentUser(user);
    
    Alert.alert('登錄成功！', '歡迎回到 UGood！', [
      { text: '確定', onPress: () => setCurrentScreen('home') }
    ]);
    
    // 清空表單
    setEmail('');
    setPassword('');
  };

  // 處理登出
  const handleLogout = async () => {
    await AsyncStorage.removeItem('ugood_user');
    await AsyncStorage.removeItem('ugood_trouble');
    setCurrentUser(null);
    setTodayTrouble('');
    setHasSharedTrouble(false);
    setMatchStatus('none');
    setCurrentMatch(null);
    setCurrentScreen('welcome');
  };

  // 保存困擾
  const saveTrouble = async () => {
    if (!todayTrouble.trim()) {
      Alert.alert('提示', '請輸入您的困擾');
      return;
    }

    await AsyncStorage.setItem('ugood_trouble', todayTrouble);
    setHasSharedTrouble(true);
    setMatchStatus('waiting');
    
    Alert.alert('保存成功！', '您的困擾已保存，系統將在晚上8點自動為您尋找配對', [
      { text: '確定', onPress: () => setCurrentScreen('home') }
    ]);
  };

  // 模擬配對
  const simulateMatch = () => {
    const mockMatch = {
      id: 'match_' + Date.now(),
      trouble: '最近工作壓力很大，感覺快撐不下去了...',
      user: { nickname: '匿名朋友' },
      timestamp: new Date().toISOString()
    };
    
    setCurrentMatch(mockMatch);
    setMatchStatus('matched');
    Alert.alert('配對成功！', '已為您找到一位需要關懷的朋友', [
      { text: '查看', onPress: () => setCurrentScreen('todayMatch') }
    ]);
  };

  // 獲取時間問候語
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早安';
    if (hour < 18) return '午安';
    return '晚安';
  };

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
          placeholder="密碼（至少6位）"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleRegister}
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
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>登錄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 主頁面
  const HomeScreen = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 頂部問候 */}
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.greeting}>{getTimeGreeting()}！</Text>
          <Text style={styles.userName}>{currentUser?.nickname || '朋友'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>登出</Text>
        </TouchableOpacity>
      </View>

      {/* 今日配對狀態 */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          {matchStatus === 'none' && '今日配對：未開始'}
          {matchStatus === 'waiting' && '今日配對：等待中'}
          {matchStatus === 'matched' && '今日配對：已配對'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {matchStatus === 'none' && '分享今日困擾來尋找配對'}
          {matchStatus === 'waiting' && '晚上8點進行配對'}
          {matchStatus === 'matched' && '已為您找到需要關懷的朋友'}
        </Text>
        
        {matchStatus === 'none' && (
          <TouchableOpacity 
            style={styles.statusButton}
            onPress={() => setCurrentScreen('shareTrouble')}
          >
            <Text style={styles.statusButtonText}>分享困擾</Text>
          </TouchableOpacity>
        )}
        
        {matchStatus === 'waiting' && (
          <TouchableOpacity 
            style={styles.statusButton}
            onPress={simulateMatch}
          >
            <Text style={styles.statusButtonText}>模擬配對（測試）</Text>
          </TouchableOpacity>
        )}
        
        {matchStatus === 'matched' && (
          <TouchableOpacity 
            style={styles.statusButton}
            onPress={() => setCurrentScreen('todayMatch')}
          >
            <Text style={styles.statusButtonText}>查看配對</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 快速操作 */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => setCurrentScreen('shareTrouble')}
        >
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionTitle}>分享困擾</Text>
          <Text style={styles.actionSubtitle}>寫下今日的困擾</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => setCurrentScreen('todayMatch')}
        >
          <Text style={styles.actionIcon}>🎯</Text>
          <Text style={styles.actionTitle}>今日配對</Text>
          <Text style={styles.actionSubtitle}>查看配對結果</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => setCurrentScreen('listenBlessing')}
        >
          <Text style={styles.actionIcon}>🎤</Text>
          <Text style={styles.actionTitle}>聆聽祝福</Text>
          <Text style={styles.actionSubtitle}>收聽溫暖話語</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // 分享困擾頁面
  const ShareTroubleScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>分享困擾</Text>
      </View>

      <View style={styles.troubleSection}>
        <Text style={styles.troubleTitle}>寫下您的困擾</Text>
        <Text style={styles.troubleSubtitle}>在這裡安全地分享您的心情，會有陌生朋友為您送上溫暖</Text>
        
        <TextInput
          style={styles.troubleInput}
          placeholder="在這裡寫下你的困擾，讓陌生人給你溫暖..."
          value={todayTrouble}
          onChangeText={setTodayTrouble}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          placeholderTextColor={todayTrouble ? "#333" : "#999"}
        />

        <View style={styles.troubleFooter}>
          <Text style={styles.troubleNote}>
            💡 系統每晚8點自動配對，您無需重複操作
          </Text>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={saveTrouble}
          >
            <Text style={styles.primaryButtonText}>保存困擾</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // 今日配對頁面
  const TodayMatchScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>今日配對</Text>
      </View>

      <View style={styles.matchSection}>
        {!hasSharedTrouble ? (
          <View style={styles.noMatchContainer}>
            <Text style={styles.noMatchIcon}>📝</Text>
            <Text style={styles.noMatchTitle}>還沒有分享困擾</Text>
            <Text style={styles.noMatchSubtitle}>分享今日困擾來尋找配對</Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setCurrentScreen('shareTrouble')}
            >
              <Text style={styles.primaryButtonText}>分享困擾</Text>
            </TouchableOpacity>
          </View>
        ) : !currentMatch ? (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingIcon}>⏳</Text>
            <Text style={styles.waitingTitle}>等待中...</Text>
            <Text style={styles.waitingSubtitle}>晚上8點進行配對</Text>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={simulateMatch}
            >
              <Text style={styles.secondaryButtonText}>模擬配對（測試）</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.matchedContainer}>
            <Text style={styles.matchTitle}>🎯 已為您找到配對</Text>
            <Text style={styles.matchSubtitle}>這位朋友需要您的溫暖關懷</Text>
            
            <View style={styles.troubleCard}>
              <Text style={styles.troubleCardTitle}>Ta的困擾：</Text>
              <Text style={styles.troubleCardContent}>{currentMatch.trouble}</Text>
            </View>

            <Text style={styles.recordingTitle}>🎤 為Ta錄製祝福語音</Text>
            <Text style={styles.recordingSubtitle}>為這位陌生朋友錄製一段溫暖的祝福話語</Text>
            
            <TouchableOpacity style={styles.recordButton}>
              <Text style={styles.recordButtonText}>開始錄音</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  // 聆聽祝福頁面
  const ListenBlessingScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>聆聽祝福</Text>
      </View>

      <View style={styles.blessingSection}>
        {!hasSharedTrouble ? (
          <View style={styles.noBlessingContainer}>
            <Text style={styles.noBlessingIcon}>📝</Text>
            <Text style={styles.noBlessingTitle}>還沒有分享困擾</Text>
            <Text style={styles.noBlessingSubtitle}>分享困擾後才能收到祝福</Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setCurrentScreen('shareTrouble')}
            >
              <Text style={styles.primaryButtonText}>分享困擾</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.blessingTitle}>您的困擾</Text>
            <View style={styles.troubleCard}>
              <Text style={styles.troubleCardContent}>{todayTrouble}</Text>
            </View>

            <Text style={styles.blessingTitle}>🎤 陌生人給您的祝福</Text>
            <View style={styles.audioCard}>
              <Text style={styles.audioStatus}>等待祝福中...</Text>
              <Text style={styles.audioSubtext}>當有人為您錄製祝福後，您就可以在這裡聆聽</Text>
            </View>
          </View>
        )}
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
    case 'shareTrouble':
      return <ShareTroubleScreen />;
    case 'todayMatch':
      return <TodayMatchScreen />;
    case 'listenBlessing':
      return <ListenBlessingScreen />;
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
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  userName: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
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
  statusCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statusButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  // 困擾頁面樣式
  troubleSection: {
    flex: 1,
  },
  troubleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  troubleSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  troubleInput: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    fontSize: 16,
    height: 200,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 30,
  },
  troubleFooter: {
    alignItems: 'center',
  },
  troubleNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  // 配對頁面樣式
  matchSection: {
    flex: 1,
    justifyContent: 'center',
  },
  noMatchContainer: {
    alignItems: 'center',
  },
  noMatchIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  noMatchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noMatchSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  waitingContainer: {
    alignItems: 'center',
  },
  waitingIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  waitingSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  matchedContainer: {
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  matchSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  troubleCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  troubleCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  troubleCardContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  recordingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  recordingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  // 祝福頁面樣式
  blessingSection: {
    flex: 1,
  },
  noBlessingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBlessingIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  noBlessingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noBlessingSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  blessingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  audioCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 30,
  },
  audioStatus: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  audioSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

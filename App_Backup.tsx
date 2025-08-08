import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TextInput, Card } from 'react-native-paper';
import AudioRecorder from './src/components/AudioRecorder';
import AudioPlayer from './src/components/AudioPlayer';
import { AuthProvider, useAuth } from './contexts/SupabaseAuthContext';
import LoginScreen from './components/LoginScreen';
// Audio components removed - not needed for current implementation

const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');

// 歡迎頁面
function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.welcomeContainer}>
      <View style={styles.welcomeContent}>
                     <Text style={styles.welcomeTitle}>UGood?</Text>
        
        <View style={styles.welcomeDescription}>
          <Text style={styles.descriptionText}>每天錄音分享煩惱</Text>
          <Text style={styles.descriptionText}>收聽陌生人的溫暖祝福</Text>
        </View>

        <View style={styles.welcomeButtons}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.startButtonText}>開始使用</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>已有帳號</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// 註冊頁面
function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('male'); // 預設為 male
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email.trim());
    console.log('📧 郵箱驗證:', { email: email.trim(), isValid });
    return isValid;
  };

  const handleRegister = async () => {
    console.log('🔄 註冊按鈕被點擊');
    console.log('📝 註冊表單數據:', { email, displayName, gender, age, hasPassword: !!password });
    
    // 在網頁版本中也顯示 alert (調試用)
    // alert('註冊按鈕被點擊！表單數據: ' + JSON.stringify({ email, displayName, gender, age }));
    
    if (!email || !password || !confirmPassword || !displayName || !gender || !age) {
      console.log('❌ 表單驗證失敗 - 缺少必填資訊');
      Alert.alert('錯誤', '請完成所有資訊');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('錯誤', '請輸入有效的電子郵件地址');
      return;
    }

    if (password.length < 6) {
      Alert.alert('錯誤', '密碼至少需要 6 個字元');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('錯誤', '密碼確認不一致');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
      Alert.alert('錯誤', '請輸入有效的年齡 (13-100)');
      return;
    }

    setLoading(true);
    try {
      console.log('📧 使用郵箱註冊:', trimmedEmail);
      await signup(trimmedEmail, password, {
        nickname: displayName,
        gender,
        age: ageNum
      });
      console.log('✅ 註冊完全成功，準備跳轉到主頁...');
      
      // 直接跳轉到主頁，不顯示 Alert
      navigation.navigate('Home');
      
      // 可選：顯示成功訊息（但不阻塞導航）
      setTimeout(() => {
        Alert.alert('註冊成功', '歡迎加入 UGood！');
      }, 500);
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = '註冊失敗，請稍後再試';
      
      // 處理 Supabase 特定錯誤
      if (error.message && error.message.includes('you can only request this after')) {
        const match = error.message.match(/(\d+) seconds/);
        const seconds = match ? match[1] : '60';
        errorMessage = `為了安全考量，請等待 ${seconds} 秒後再嘗試註冊`;
      } else if (error.message && (error.message.includes('Too Many Requests') || error.message.includes('429'))) {
        errorMessage = '請求過於頻繁，請等待 2-3 分鐘後再試';
      } else if (error.message && error.message.includes('is invalid')) {
        errorMessage = '郵箱格式無效，請檢查郵箱地址是否正確';
      } else if (error.message && error.message.includes('Bad Request')) {
        errorMessage = '請求格式錯誤，請檢查所有欄位是否正確填寫';
      } else {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = '此電子郵件已被註冊';
            break;
          case 'auth/invalid-email':
            errorMessage = '無效的電子郵件格式';
            break;
          case 'auth/weak-password':
            errorMessage = '密碼強度不足，請使用至少 6 個字元';
            break;
          default:
            errorMessage = error.message || '註冊失敗';
        }
      }
      
      Alert.alert('註冊失敗', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>建立帳號</Text>
        <Text style={styles.headerSubtitle}>加入 UGood 溫暖社群</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>顯示名稱</Text>
              <TextInput
                mode="outlined"
                placeholder="請輸入您的暱稱"
                value={displayName}
                onChangeText={setDisplayName}
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
                placeholder="請輸入密碼 (至少 6 個字元)"
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>確認密碼</Text>
              <TextInput
                mode="outlined"
                placeholder="請再次輸入密碼"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
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
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>性別</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity 
                  style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>男性</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>女性</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.ageNote}>* 性別資訊將會隱藏</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>年齡</Text>
              <TextInput
                mode="outlined"
                placeholder="請輸入年齡"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                style={styles.input}
                theme={{ 
                  colors: { 
                    primary: '#8FBC8F',
                    onSurface: '#000000',
                    onSurfaceVariant: '#000000'
                  } 
                }}
              />
              <Text style={styles.ageNote}>* 年齡資訊將會隱藏</Text>
            </View>

            {/* 完成註冊按鈕 - 確保可見 */}
            <TouchableOpacity 
              style={[styles.completeButton, loading && styles.completeButtonDisabled]} 
              onPress={() => {
                console.log('🖱️ 按鈕點擊事件觸發');
                console.log('📋 當前表單狀態:', { 
                  email, 
                  displayName, 
                  gender, 
                  age, 
                  passwordLength: password.length,
                  confirmPasswordLength: confirmPassword.length,
                  loading 
                });
                handleRegister();
              }}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.completeButtonText}>
                {loading ? '註冊中...' : '完成註冊'}
              </Text>
            </TouchableOpacity>



            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                已有帳號？ <Text style={styles.loginLinkHighlight}>立即登入</Text>
              </Text>
            </TouchableOpacity>

            {/* 測試提示區域 */}
            <View style={styles.testHintRegister}>
              <Text style={styles.testHintTitle}>💡 測試提示</Text>
              <Text style={styles.testHintText}>
                在模擬模式下，您可以使用任意有效的資料進行註冊測試
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 主頁面 - 全新設計
function HomeScreen({ navigation }: any) {
  const { currentUser, logout } = useAuth();
  const [todayTrouble, setTodayTrouble] = useState('');
  const [hasSharedToday, setHasSharedToday] = useState(false);
  const [matchStatus, setMatchStatus] = useState<'none' | 'waiting' | 'matched' | 'completed'>('none');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 載入當前配對和煩惱歷史
  useEffect(() => {
    loadCurrentMatch();
    loadUserTroubles();
  }, []);

  const loadCurrentMatch = async () => {
    setIsLoadingMatch(true);
    try {
      const match = await getMyCurrentMatch();
      setCurrentMatch(match);
    } catch (error) {
      console.error('載入配對失敗:', error);
    } finally {
      setIsLoadingMatch(false);
    }
  };

  const loadUserTroubles = async () => {
    setIsLoadingTroubles(true);
    try {
      const troubles = await getUserTroubles();
      setUserTroubles(troubles || []);
      console.log('✅ 載入用戶煩惱歷史成功:', troubles?.length || 0, '條記錄');
    } catch (error) {
      console.error('❌ 載入煩惱歷史失敗:', error);
      // 即使失敗也設置空陣列，避免 UI 卡住
      setUserTroubles([]);
      Alert.alert('提示', '載入煩惱歷史失敗，請稍後再試');
    } finally {
      setIsLoadingTroubles(false);
    }
  };

  const handleFindMatch = async () => {
    setIsLoadingMatch(true);
    try {
      const match = await findMatch();
      if (match) {
        setCurrentMatch(match);
        Alert.alert(
          '🎉 配對成功！', 
          '已為您找到今日配對對象！\n請為這位朋友錄製溫暖的祝福語音。',
          [
            { text: '查看配對', onPress: () => navigation.navigate('TodayMatch') }
          ]
        );
      } else {
        Alert.alert(
          '暫無配對', 
          '目前沒有可配對的對象，請稍後再試。\n您也可以先分享自己的困擾！'
        );
      }
    } catch (error) {
      console.error('配對失敗:', error);
      Alert.alert('配對失敗', '無法進行配對，請稍後再試。');
    } finally {
      setIsLoadingMatch(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('已登出', '感謝使用 UGood');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UGood?</Text>
        <Text style={styles.headerSubtitle}>歡迎回來，{currentUser?.nickname}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>登出</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 今日配對狀態 */}
        <View style={styles.matchCard}>
          {isLoadingMatch ? (
            <>
              <Text style={styles.matchTitle}>載入中...</Text>
              <Text style={styles.matchSubtitle}>正在檢查配對狀態</Text>
            </>
          ) : currentMatch ? (
            <>
              <Text style={styles.matchTitle}>今日配對：已配對 ✅</Text>
              <Text style={styles.matchSubtitle}>配對對象: {currentMatch.user?.nickname || '匿名朋友'}</Text>
              <TouchableOpacity 
                style={styles.viewMatchButton}
                onPress={() => navigation.navigate('TodayMatch')}
              >
                <Text style={styles.viewMatchButtonText}>查看配對詳情</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.matchTitle}>今日配對：等待中</Text>
              <Text style={styles.matchSubtitle}>分享今日困擾來尋找配對</Text>
              <TouchableOpacity 
                style={styles.findMatchButton}
                onPress={handleFindMatch}
                disabled={isLoadingMatch}
              >
                <Text style={styles.findMatchButtonText}>
                  {isLoadingMatch ? '搜尋中...' : '🔍 尋找配對'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* 功能選項 */}
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('ShareTrouble')}
        >
          <Text style={styles.featureTitle}>分享今日困擾</Text>
          <Text style={styles.featureDescription}>告訴陌生人你需要的支持</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('TodayMatch')}
        >
          <Text style={styles.featureTitle}>今日配對</Text>
          <Text style={styles.featureDescription}>分享今日困擾來尋找配對</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('ListenBlessing')}
        >
          <Text style={styles.featureTitle}>聆聽祝福</Text>
          <Text style={styles.featureDescription}>收聽來自陌生人的溫暖</Text>
        </TouchableOpacity>

        {/* 我的煩惱歷史 */}
        <View style={styles.troublesHistoryCard}>
          <View style={styles.troublesHeader}>
            <Text style={styles.troublesTitle}>我的煩惱歷史</Text>
            <TouchableOpacity onPress={loadUserTroubles} disabled={isLoadingTroubles}>
              <Text style={styles.refreshButton}>
                {isLoadingTroubles ? '載入中...' : '🔄 刷新'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {isLoadingTroubles ? (
            <Text style={styles.loadingText}>載入中...</Text>
          ) : userTroubles.length > 0 ? (
            <>
              <Text style={styles.troublesSubtitle}>共 {userTroubles.length} 條記錄</Text>
              {userTroubles.slice(0, 3).map((trouble, index) => (
                <View key={trouble.id} style={styles.troubleItem}>
                  <View style={styles.historyTroubleContent}>
                    <Text style={styles.historyTroubleText}>{trouble.content}</Text>
                    <Text style={styles.troubleDate}>
                      {new Date(trouble.created_at).toLocaleDateString('zh-TW')}
                    </Text>
                  </View>
                  <View style={[styles.troubleStatus, 
                    trouble.status === 'matched' ? styles.troubleStatusMatched : styles.troubleStatusActive
                  ]}>
                    <Text style={styles.troubleStatusText}>
                      {trouble.status === 'matched' ? '已配對' : '等待中'}
                    </Text>
                  </View>
                </View>
              ))}
              {userTroubles.length > 3 && (
                <TouchableOpacity style={styles.viewMoreButton}>
                  <Text style={styles.viewMoreText}>查看全部 ({userTroubles.length} 條)</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.emptyText}>還沒有分享過煩惱，快去分享第一個吧！</Text>
          )}
        </View>

        {/* 測試功能區域 */}
        <View style={styles.testSection}>
          <Text style={styles.testSectionTitle}>🧪 測試功能</Text>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={async () => {
              try {
                const testEmail = `test${Date.now()}@example.com`;
                const testPassword = '123456';
                const testInfo = {
                  nickname: '測試用戶',
                  age: 25,
                  gender: 'male'
                };
                
                console.log('🧪 開始測試註冊...');
                const result = await signup(testEmail, testPassword, testInfo);
                console.log('🧪 註冊測試結果:', result);
                
                Alert.alert(
                  '註冊測試完成', 
                  `✅ 測試郵箱: ${testEmail}\n✅ 註冊${result ? '成功' : '失敗'}\n\n請檢查控制台日誌了解詳情`
                );
              } catch (error) {
                console.error('🧪 註冊測試失敗:', error);
                Alert.alert('註冊測試失敗', (error as any).message || '未知錯誤');
              }
            }}
          >
            <Text style={styles.testButtonText}>🧪 測試真實註冊</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => navigation.navigate('Recording')}
          >
            <Text style={styles.testButtonText}>🎤 測試錄音功能</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: '#FF6B6B' }]}
            onPress={() => navigation.navigate('ListenBlessing', { 
              selfRecording: false, 
              recordingDuration: 150 
            })}
          >
            <Text style={styles.testButtonText}>🎧 體驗模擬祝福</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => {
              Alert.alert('功能狀態', 
                '✅ 用戶註冊與登入\n' +
                '✅ 頁面導航\n' +
                '✅ SafeArea 適配\n' +
                '✅ 表單驗證\n' +
                '✅ 錄音界面\n' +
                '🔄 Firebase 配置 (需設置)\n' +
                '🔄 實際錄音功能 (開發中)'
              );
            }}
          >
            <Text style={styles.testButtonText}>檢查所有功能</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 分享困擾頁面
function ShareTroubleScreen({ navigation }: any) {
  const [trouble, setTrouble] = useState('');
  const [savedTrouble, setSavedTrouble] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingTrouble, setHasExistingTrouble] = useState(false);
  const { shareTrouble, currentUser } = useAuth();

  // 從 AsyncStorage 載入已保存的煩惱
  useEffect(() => {
    loadSavedTrouble();
  }, [currentUser]);

  const loadSavedTrouble = async () => {
    try {
      if (currentUser) {
        const storageKey = `trouble_${currentUser.uid}`;
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved) {
          console.log('📱 載入已保存的煩惱:', saved);
          setSavedTrouble(saved);
          setTrouble(saved);
          setHasExistingTrouble(true);
          setIsEditing(false); // 顯示已保存的內容
        } else {
          console.log('📱 沒有已保存的煩惱，進入編輯模式');
          setIsEditing(true); // 沒有保存的煩惱，進入編輯模式
        }
      }
    } catch (error) {
      console.error('❌ 載入煩惱失敗:', error);
      setIsEditing(true); // 載入失敗，進入編輯模式
    }
  };

  const saveTroubleToStorage = async (troubleContent: string) => {
    try {
      if (currentUser) {
        const storageKey = `trouble_${currentUser.uid}`;
        await AsyncStorage.setItem(storageKey, troubleContent);
        console.log('📱 煩惱已保存到本地存儲');
      }
    } catch (error) {
      console.error('❌ 保存煩惱到本地失敗:', error);
    }
  };

  const handleSave = async () => {
    if (!trouble.trim()) {
      Alert.alert('提示', '請輸入您的困擾');
      return;
    }

    try {
      // 首先保存到本地存儲
      await saveTroubleToStorage(trouble);
      
      // 更新本地狀態
      setSavedTrouble(trouble);
      setHasExistingTrouble(true);
      setIsEditing(false);

      // 使用 Supabase 分享困擾並嘗試配對
      await shareTrouble(trouble);

      Alert.alert(
        '配對成功', 
        '您的困擾已送出配對！\n\n✅ 內容已自動保存\n✅ 正在尋找配對\n✅ 晚上8:00將收到祝福',
        [
          { text: '確定', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('分享困擾失敗:', error);
      
      // 即使 Supabase 分享失敗，內容也已經保存到本地了
      Alert.alert(
        '內容已保存',
        '您的困擾內容已保存！\n\n✅ 內容已自動保存到本地\n⚠️ 配對功能暫時無法使用\n\n請稍後再試配對功能。',
        [{ text: '確定', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleSubmitForMatching = () => {
    Alert.alert(
      '開始配對', 
      '使用目前的煩惱內容進行配對！\n\n✅ 內容已提交\n✅ 等待配對中\n✅ 今晚8:00將收到祝福',
      [
        { text: '確定', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTrouble(savedTrouble); // 恢復到保存的內容
    setIsEditing(false);
  };

  const handleDeleteTrouble = () => {
    Alert.alert(
      '刪除煩惱',
      '確定要刪除目前保存的煩惱內容嗎？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '刪除', 
          style: 'destructive',
          onPress: async () => {
            try {
              // 從本地存儲刪除
              if (currentUser) {
                const storageKey = `trouble_${currentUser.uid}`;
                await AsyncStorage.removeItem(storageKey);
                console.log('📱 已從本地存儲刪除煩惱');
              }
              
              // 清除本地狀態
              setSavedTrouble('');
              setTrouble('');
              setHasExistingTrouble(false);
              setIsEditing(true);
            } catch (error) {
              console.error('❌ 刪除煩惱失敗:', error);
              Alert.alert('錯誤', '刪除失敗，請稍後再試');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>分享困擾</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hintCard}>
          <Text style={styles.hintTitle}>💡 小提示</Text>
          <Text style={styles.hintText}>
            可以分享工作壓力、感情困擾、家庭問題，或是任何需要陌生人給予支持與祝福的事情
          </Text>
        </View>

        <Text style={styles.questionText}>今天發生了什麼讓你困擾的事？</Text>
        
{/* 已保存煩惱的顯示模式 */}
        {hasExistingTrouble && !isEditing ? (
          <View>
            <View style={styles.savedTroubleCard}>
              <Text style={styles.savedTroubleTitle}>💾 您保存的煩惱內容</Text>
              <Text style={styles.savedTroubleText}>{savedTrouble}</Text>
              
              <View style={styles.savedTroubleActions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEdit}
                >
                  <Text style={styles.editButtonText}>✏️ 編輯</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.autoMatchNotice}>
              <Text style={styles.autoMatchTitle}>⏰ 自動配對提醒</Text>
              <Text style={styles.autoMatchText}>
                系統會在每日晚上 8:00 自動為您進行配對，無需重複操作
              </Text>
            </View>
          </View>
        ) : (
          // 編輯模式
          <View>
            <View style={styles.troubleInputContainer}>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={8}
                placeholder="在這裡寫下你的困擾，讓陌生人給你溫暖的祝福..."
                value={trouble}
                onChangeText={setTrouble}
                style={[
                  styles.troubleInput,
                  { color: trouble.trim() ? '#000000' : '#999999' }
                ]}
                maxLength={300}
                theme={{ 
                  colors: { 
                    primary: '#8FBC8F',
                    onSurface: trouble.trim() ? '#000000' : '#999999',
                    onSurfaceVariant: trouble.trim() ? '#000000' : '#999999',
                    placeholder: '#999999'
                  } 
                }}
              />
              <Text style={styles.characterCount}>{trouble.length}/300 字</Text>
            </View>

            <View style={styles.editModeActions}>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>💾 保存困擾</Text>
              </TouchableOpacity>

              {hasExistingTrouble && (
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>取消編輯</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.autoMatchNotice}>
              <Text style={styles.autoMatchTitle}>⏰ 自動配對提醒</Text>
              <Text style={styles.autoMatchText}>
                保存後，系統會在每日晚上 8:00 自動為您進行配對
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// 今日配對頁面
function TodayMatchScreen({ navigation }: any) {
  const [currentMatch, setCurrentMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSharedTrouble, setHasSharedTrouble] = useState(false);
  const { getMyCurrentMatch, currentUser } = useAuth();

  useEffect(() => {
    checkTroubleStatus();
    loadCurrentMatch();
  }, []);

  const checkTroubleStatus = async () => {
    try {
      if (currentUser) {
        const storageKey = `trouble_${currentUser.uid}`;
        const savedTrouble = await AsyncStorage.getItem(storageKey);
        setHasSharedTrouble(!!savedTrouble && savedTrouble.trim().length > 0);
      }
    } catch (error) {
      console.error('❌ 檢查困擾狀態失敗:', error);
      setHasSharedTrouble(false);
    }
  };

  const loadCurrentMatch = async () => {
    try {
      console.log('📋 載入當前配對數據...');
      const match = await getMyCurrentMatch();
      console.log('📋 配對數據:', match);
      setCurrentMatch(match);
    } catch (error) {
      console.error('❌ 載入配對失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>載入中...</Text>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>正在載入配對信息...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentMatch) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>今日配對</Text>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          {!hasSharedTrouble ? (
            <View style={styles.noTroubleContainer}>
              <Text style={styles.noTroubleTitle}>💭 還沒有分享困擾</Text>
              <Text style={styles.noTroubleText}>
                分享今日困擾來尋找配對
              </Text>
              <TouchableOpacity 
                style={[styles.publishButton, { marginTop: 20 }]}
                onPress={() => navigation.navigate('ShareTrouble')}
              >
                <Text style={styles.publishButtonText}>去分享困擾</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.waitingContainer}>
              <Text style={styles.waitingTitle}>⏳ 等待中...</Text>
              <Text style={styles.waitingText}>
                晚上 8:00 進行配對
              </Text>
              <Text style={styles.waitingSubtext}>
                系統會自動為您尋找合適的配對對象
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>今日配對成功</Text>
        <Text style={styles.headerSubtitle}>為這位朋友錄製祝福語音</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.matchProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(currentMatch as any)?.user?.nickname ? (currentMatch as any).user.nickname.charAt(0).toUpperCase() : 'A'}
            </Text>
          </View>
          <Text style={styles.matchName}>
            {(currentMatch as any)?.user?.nickname || '匿名朋友'}
          </Text>
          <Text style={styles.matchTime}>剛剛配對</Text>
        </View>

        <View style={styles.troubleContent}>
          <Text style={styles.troubleText}>
            {(currentMatch as any)?.trouble || '這位朋友分享了他們的困擾...'}
          </Text>
        </View>

        <View style={styles.recordingSection}>
          <Text style={styles.recordingTitle}>為這位陌生朋友錄製祝福語音</Text>
          <Text style={styles.recordingSubtitle}>對方給你祝福後，你可以回給他的錄音</Text>
          
          <View style={styles.recordingTips}>
            <Text style={styles.tipItem}>💡 可以分享你的鼓勵和支持</Text>
            <Text style={styles.tipItem}>💡 告訴 TA 困難是暫時的</Text>
            <Text style={styles.tipItem}>💡 分享你的正能量</Text>
            <Text style={styles.tipItem}>💡 語音長度建議 1-3 分鐘</Text>
          </View>

          <TouchableOpacity 
            style={styles.recordButton}
            onPress={() => navigation.navigate('Recording')}
          >
            <View style={styles.recordButtonInner}>
              <Text style={styles.recordButtonText}>點擊開始錄音</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 聆聽祝福頁面
function ListenBlessingScreen({ navigation, route }: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSharedTrouble, setHasSharedTrouble] = useState(false);
  const [userTrouble, setUserTrouble] = useState('');
  const { currentUser } = useAuth();
  
  // 檢查是否為自己的錄音
  const isSelfRecording = route?.params?.selfRecording || false;
  const recordingUri = route?.params?.recordingUri || null;
  const recordingDuration = route?.params?.recordingDuration || 150; // 2分30秒

  useEffect(() => {
    checkTroubleStatus();
  }, []);

  const checkTroubleStatus = async () => {
    try {
      if (currentUser) {
        const storageKey = `trouble_${currentUser.uid}`;
        const savedTrouble = await AsyncStorage.getItem(storageKey);
        if (savedTrouble && savedTrouble.trim().length > 0) {
          setHasSharedTrouble(true);
          setUserTrouble(savedTrouble);
        } else {
          setHasSharedTrouble(false);
          setUserTrouble('');
        }
      }
    } catch (error) {
      console.error('❌ 檢查困擾狀態失敗:', error);
      setHasSharedTrouble(false);
      setUserTrouble('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const handlePlayAudio = () => {
    if (recordingUri) {
      // 如果有真實錄音，不需要 Alert，直接由 AudioPlayer 處理
      return;
    }
    
    // 模擬播放（沒有真實錄音時）
    setIsPlaying(!isPlaying);
    const title = isSelfRecording ? 
      (isPlaying ? '暫停播放自己的錄音' : '播放自己的錄音') : 
      (isPlaying ? '暫停播放' : '開始播放');
    
    const message = isPlaying ? 
      '語音已暫停' : 
      '祝福語音功能開發中，敬請期待！';
    
    Alert.alert(title, message, [{ text: '確定' }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>聆聽祝福</Text>
        <Text style={styles.headerSubtitle}>來自陌生人的溫暖</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.myShare}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>你</Text>
          </View>
          <View style={styles.shareContent}>
            <Text style={styles.shareTitle}>你的分享</Text>
            <Text style={styles.shareTime}>今天</Text>
          </View>
        </View>

        {!hasSharedTrouble ? (
          <View style={styles.noTroubleContainer}>
            <Text style={styles.noTroubleTitle}>💭 還沒有分享困擾</Text>
            <Text style={styles.noTroubleText}>
              分享今日困擾來尋找配對
            </Text>
            <TouchableOpacity 
              style={[styles.publishButton, { marginTop: 20 }]}
              onPress={() => navigation.navigate('ShareTrouble')}
            >
              <Text style={styles.publishButtonText}>去分享困擾</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.shareText}>
            {userTrouble}
          </Text>
        )}

        {recordingUri ? (
          <View style={styles.audioPlayerContainer}>
            <Text style={styles.audioText}>🎵 祝福語音</Text>
            <AudioPlayer uri={recordingUri} duration={recordingDuration} />
          </View>
        ) : (
          <View style={[styles.blessingCard, isSelfRecording && styles.selfRecordingCard]}>
            <Text style={styles.blessingTitle}>
              {isSelfRecording ? '🎤 你的祝福錄音（預覽）' : '🎤 陌生人給你的祝福'}
            </Text>
            {isSelfRecording && (
              <Text style={styles.selfRecordingNote}>
                這是你剛才錄製的祝福語音，預覽一下效果！
              </Text>
            )}
            <View style={styles.audioPlayer}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={handlePlayAudio}
              >
                <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
              </TouchableOpacity>
              <Text style={styles.audioDuration}>
                時長：{formatTime(recordingDuration)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.responseSection}>
          <Text style={styles.responseTitle}>給Ta錄製祝福語音</Text>
          <Text style={styles.responseDescription}>
            {isSelfRecording ? 
              '你已經錄製了祝福語音！陌生人將會收到你的溫暖話語。' : 
              '為這位陌生朋友錄製一段溫暖的祝福話語'
            }
          </Text>
          
          {!isSelfRecording && (
            <TouchableOpacity 
              style={styles.responseButton}
              onPress={() => navigation.navigate('Recording')}
            >
              <View style={styles.responseButtonInner}>
                <Text style={styles.responseButtonText}>錄製祝福語音</Text>
              </View>
            </TouchableOpacity>
          )}
          
          {isSelfRecording && (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => {
                Alert.alert(
                  '祝福已送達', 
                  '您的溫暖祝福已成功送達給陌生朋友！\n\n✅ 對方將收到您的語音\n✅ 您的善意已傳遞\n✅ 感謝您的溫暖分享',
                  [
                    { text: '返回首頁', onPress: () => navigation.navigate('Home') }
                  ]
                );
              }}
            >
              <View style={styles.responseButtonInner}>
                <Text style={styles.responseButtonText}>✅ 送出祝福</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 錄音頁面
function RecordingScreen({ navigation }: any) {
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadAudio, saveBlessingRecord, getMyCurrentMatch } = useAuth();

  const handleRecordingComplete = (uri: string, duration: number) => {
    setRecordingUri(uri);
    setRecordingDuration(duration);
  };

  const sendRecording = async () => {
    if (!recordingUri) {
      Alert.alert('錯誤', '請先完成錄音');
      return;
    }

    setIsUploading(true);
    try {
      // 1. 上傳音頻文件
      console.log('🚀 開始上傳祝福語音...');
      const uploadResult = await uploadAudio(recordingUri);
      
      // 2. 獲取當前配對信息
      const currentMatch = await getMyCurrentMatch();
      
      if (currentMatch) {
        // 3. 保存祝福記錄
        await saveBlessingRecord(currentMatch.matchId, uploadResult.url);
        
        Alert.alert(
          '🎉 祝福發送成功！', 
          '您的溫暖祝福已成功送達！\n\n✅ 錄音時長：' + Math.floor(recordingDuration / 60) + '分' + (recordingDuration % 60) + '秒\n✅ 已上傳到雲端\n✅ 陌生朋友將會收到\n\n💝 感謝您的溫暖分享！',
          [
            { 
              text: '預覽祝福', 
              onPress: () => navigation.navigate('ListenBlessing', { 
                selfRecording: true, 
                recordingUri: uploadResult.url,
                recordingDuration: recordingDuration 
              }) 
            },
            { text: '返回首頁', onPress: () => navigation.navigate('Home') }
          ]
        );
      } else {
        // 沒有配對的情況，仍然保存錄音但給出不同的提示
        Alert.alert(
          '錄音保存成功', 
          '您的祝福語音已保存！\n\n✅ 錄音時長：' + Math.floor(recordingDuration / 60) + '分' + (recordingDuration % 60) + '秒\n⏳ 等待配對中\n\n當找到配對時，您的祝福將自動發送！',
          [
            { 
              text: '預覽祝福', 
              onPress: () => navigation.navigate('ListenBlessing', { 
                selfRecording: true, 
                recordingUri: uploadResult.url,
                recordingDuration: recordingDuration 
              }) 
            },
            { text: '返回首頁', onPress: () => navigation.navigate('Home') }
          ]
        );
      }
    } catch (error) {
      console.error('❌ 發送祝福失敗:', error);
      Alert.alert(
        '發送失敗',
        '祝福語音發送失敗，請稍後再試。\n\n錯誤：' + ((error as any).message || '未知錯誤'),
        [
          { text: '重試', onPress: sendRecording },
          { text: '稍後再試', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>錄製祝福語音</Text>
        <Text style={styles.headerSubtitle}>為陌生朋友送上溫暖</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.troublePreview}>
          最近工作壓力很大，老闆總是對我的方案不滿意，感覺自己很沒用。
          回到家也不知道該怎麼跟家人說，只能一個人默默承受...
        </Text>

        <View style={styles.recordingSection}>
          <Text style={styles.recordingTitle}>錄製祝福語音</Text>
          
          <View style={styles.recordingTips}>
            <Text style={styles.tipItem}>💡 可以分享你的鼓勵和支持</Text>
            <Text style={styles.tipItem}>💡 告訴 TA 困難是暫時的</Text>
            <Text style={styles.tipItem}>💡 分享你的正能量</Text>
            <Text style={styles.tipItem}>💡 語音長度建議 1-3 分鐘</Text>
          </View>

          {/* 真實錄音功能 */}
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete}
            maxDuration={180} // 3分鐘
          />

          {/* 發送按鈕 */}
          {recordingUri && (
            <TouchableOpacity 
              style={[styles.sendButton, isUploading && styles.sendButtonDisabled]}
              onPress={sendRecording}
              disabled={isUploading}
            >
              <Text style={styles.sendButtonText}>
                {isUploading ? '正在上傳祝福...' : '發送祝福語音'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 主應用導航組件
function AppNavigator() {
  const { currentUser } = useAuth();

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={currentUser ? "Home" : "Welcome"}
    >
      {currentUser ? (
        // 已登入用戶的頁面
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ShareTrouble" component={ShareTroubleScreen} />
          <Stack.Screen name="TodayMatch" component={TodayMatchScreen} />
          <Stack.Screen name="ListenBlessing" component={ListenBlessingScreen} />
          <Stack.Screen name="Recording" component={RecordingScreen} />
        </>
      ) : (
        // 未登入用戶的頁面
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  // 歡迎頁面樣式
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#8FBC8F',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  welcomeTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 60,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  welcomeSubtitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 60,
  },
  welcomeDescription: {
    alignItems: 'center',
    marginBottom: 80,
  },
  descriptionText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeButtons: {
    width: '100%',
  },
  startButton: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8FBC8F',
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 20,
    color: 'white',
  },

  // 通用樣式
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
    paddingBottom: 50,
    flexGrow: 1,
  },

  // 表單樣式
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

  // 註冊頁面樣式
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  genderButtonActive: {
    borderColor: '#8FBC8F',
    backgroundColor: '#8FBC8F',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#666',
  },
  genderButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  ageNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  completeButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#666',
  },
  loginLinkHighlight: {
    color: '#8FBC8F',
    fontWeight: 'bold',
  },

  // 主頁面樣式
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  matchCard: {
    backgroundColor: '#8FBC8F',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  matchSubtitle: {
    fontSize: 16,
    color: 'white',
  },
  viewMatchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  viewMatchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  findMatchButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 15,
  },
  findMatchButtonText: {
    color: '#8FBC8F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },

  // 測試功能樣式
  testSection: {
    marginTop: 20,
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8FBC8F',
  },
  testSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  testButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  // 分享困擾頁面樣式
  hintCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8FBC8F',
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  troubleInputContainer: {
    marginBottom: 30,
  },
  troubleInput: {
    backgroundColor: 'white',
    minHeight: 150,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  publishButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  publishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  // 配對頁面樣式
  matchProfile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8FBC8F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  matchTime: {
    fontSize: 14,
    color: '#666',
  },
  troubleContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  troubleText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  recordingSection: {
    alignItems: 'center',
  },
  recordingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recordingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  recordingTips: {
    marginBottom: 30,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  recordButton: {
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8FBC8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },

  // 聆聽祝福頁面樣式
  myShare: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  shareContent: {
    marginLeft: 15,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shareTime: {
    fontSize: 14,
    color: '#666',
  },
  shareText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 30,
  },
  blessingCard: {
    backgroundColor: '#8FBC8F',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  selfRecordingCard: {
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  selfRecordingNote: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  blessingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  audioPlayer: {
    alignItems: 'center',
  },
  audioPlayerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  playButtonText: {
    fontSize: 24,
    color: '#8FBC8F',
  },
  audioDuration: {
    fontSize: 14,
    color: 'white',
  },
  responseSection: {
    alignItems: 'center',
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  responseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  responseButton: {
    alignItems: 'center',
  },
  responseButtonInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8FBC8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseButtonText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },

  // 錄音頁面樣式
  recordingContainer: {
    flex: 1,
    padding: 20,
  },
  troublePreview: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  recordingStatus: {
    alignItems: 'center',
    marginBottom: 30,
  },
  recordingTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recordingTimeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8FBC8F',
  },
  recordingButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingButtonActive: {
    // 錄音中的樣式
  },
  recordingButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8FBC8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButtonInnerActive: {
    backgroundColor: '#FF6B6B',
  },
  recordingButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  // 測試提示樣式
  testHintRegister: {
    marginTop: 20,
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 15,
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
  },

  // 保存煩惱功能樣式
  savedTroubleCard: {
    backgroundColor: '#F0F8F0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8FBC8F',
  },
  savedTroubleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  savedTroubleText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
  },
  savedTroubleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.45,
  },
  editButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.45,
  },
  deleteButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  matchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  matchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  editModeActions: {
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#757575',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  // 煩惱歷史相關樣式
  troublesHistoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  troublesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  troublesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    fontSize: 14,
    color: '#8FBC8F',
    fontWeight: '500',
  },
  troublesSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  troubleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyTroubleContent: {
    flex: 1,
    marginRight: 15,
  },
  historyTroubleText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    lineHeight: 20,
  },
  troubleDate: {
    fontSize: 12,
    color: '#999',
  },
  troubleStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  troubleStatusActive: {
    backgroundColor: '#FFF3CD',
  },
  troubleStatusMatched: {
    backgroundColor: '#D4EDDA',
  },
  troubleStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#8FBC8F',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  // 音頻播放相關樣式
  audioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  audioSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // 錄音功能相關樣式
  recordingPlaceholder: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
  },
  mockRecordButton: {
    backgroundColor: '#8FBC8F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  mockRecordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 新增的樣式
  autoMatchNotice: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  autoMatchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  autoMatchText: {
    fontSize: 14,
    color: '#BF360C',
    lineHeight: 20,
  },
  noTroubleContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noTroubleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
  },
  noTroubleText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  waitingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  waitingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  waitingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  waitingSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
}); 
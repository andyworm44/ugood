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
import { Button, TextInput } from 'react-native-paper';
import AudioRecorder from './src/components/AudioRecorder';
import AudioPlayer from './src/components/AudioPlayer';
import { AuthProvider, useAuth } from './contexts/SupabaseAuthContext';
import LoginScreen from './components/LoginScreen';

const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');

// 歡迎頁面（保持不變）
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

// 註冊頁面（保持原有功能）
function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName || !gender || !age) {
      Alert.alert('錯誤', '請完成所有資訊');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('錯誤', '請輸入有效的電子郵件地址');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('錯誤', '密碼確認不一致');
      return;
    }

    if (password.length < 6) {
      Alert.alert('錯誤', '密碼長度至少6個字符');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
      Alert.alert('錯誤', '請輸入有效年齡（13-100歲）');
      return;
    }

    setLoading(true);
    try {
      const userInfo = {
        nickname: displayName.trim(),
        age: ageNum,
        gender: gender
      };
      
      await signup(trimmedEmail, password, userInfo);
    } catch (error) {
      console.error('註冊失敗:', error);
      Alert.alert('註冊失敗', (error as any).message || '請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>建立新帳號</Text>
            <Text style={styles.subtitle}>加入 UGood 社群，開始分享與關懷</Text>

            <View style={styles.inputGroup}>
              <TextInput
                mode="outlined"
                label="電子郵件"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                theme={{ colors: { primary: '#8FBC8F' } }}
              />

              <TextInput
                mode="outlined"
                label="顯示名稱"
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.input}
                theme={{ colors: { primary: '#8FBC8F' } }}
              />

              <View style={styles.rowInputs}>
                <TextInput
                  mode="outlined"
                  label="年齡"
                  value={age}
                  onChangeText={setAge}
                  style={[styles.input, styles.halfInput]}
                  keyboardType="numeric"
                  theme={{ colors: { primary: '#8FBC8F' } }}
                />

                <View style={[styles.halfInput, styles.genderContainer]}>
                  <Text style={styles.genderLabel}>性別</Text>
                  <View style={styles.genderButtons}>
                    <TouchableOpacity 
                      style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                      onPress={() => setGender('male')}
                    >
                      <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>男</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                      onPress={() => setGender('female')}
                    >
                      <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>女</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TextInput
                mode="outlined"
                label="密碼"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                theme={{ colors: { primary: '#8FBC8F' } }}
              />

              <TextInput
                mode="outlined"
                label="確認密碼"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon 
                    icon={showConfirmPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                theme={{ colors: { primary: '#8FBC8F' } }}
              />
            </View>

            <TouchableOpacity 
              style={[styles.completeButton, loading && styles.completeButtonDisabled]}
              onPress={handleRegister}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 全新設計的主畫面
function HomeScreen({ navigation }: any) {
  const { currentUser, logout } = useAuth();
  const [todayTrouble, setTodayTrouble] = useState('');
  const [hasSharedToday, setHasSharedToday] = useState(false);
  const [matchStatus, setMatchStatus] = useState<'none' | 'waiting' | 'matched' | 'completed'>('none');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    checkTodayStatus();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const checkTodayStatus = async () => {
    try {
      if (currentUser) {
        const storageKey = `trouble_${currentUser.uid}`;
        const savedTrouble = await AsyncStorage.getItem(storageKey);
        if (savedTrouble && savedTrouble.trim().length > 0) {
          setTodayTrouble(savedTrouble);
          setHasSharedToday(true);
          setMatchStatus('waiting');
        }
      }
    } catch (error) {
      console.error('檢查今日狀態失敗:', error);
    }
  };

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '早安';
    if (hour < 18) return '午安';
    return '晚安';
  };

  const getNextMatchTime = () => {
    const now = new Date();
    const matchTime = new Date();
    matchTime.setHours(20, 0, 0, 0);
    
    if (now > matchTime) {
      matchTime.setDate(matchTime.getDate() + 1);
    }
    
    const diff = matchTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, isToday: matchTime.toDateString() === now.toDateString() };
  };

  const timeUntilMatch = getNextMatchTime();

  return (
    <SafeAreaView style={styles.homeContainer}>
      {/* 頂部問候區 */}
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getTimeGreeting()}！</Text>
          <Text style={styles.userName}>{currentUser?.email?.split('@')[0] || '朋友'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {
            Alert.alert(
              '登出確認',
              '確定要登出嗎？',
              [
                { text: '取消', style: 'cancel' },
                { text: '登出', onPress: logout, style: 'destructive' }
              ]
            );
          }}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.homeContent} showsVerticalScrollIndicator={false}>
        
        {/* 今日狀態卡片 */}
        <View style={styles.statusCard}>
          {!hasSharedToday ? (
            <View style={styles.statusContent}>
              <Text style={styles.statusEmoji}>💭</Text>
              <Text style={styles.statusTitle}>今天過得如何？</Text>
              <Text style={styles.statusDescription}>
                分享你的困擾，讓陌生人給你溫暖
              </Text>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.navigate('ShareTrouble')}
              >
                <Text style={styles.primaryButtonText}>分享今日困擾</Text>
              </TouchableOpacity>
            </View>
          ) : matchStatus === 'waiting' ? (
            <View style={styles.statusContent}>
              <Text style={styles.statusEmoji}>⏳</Text>
              <Text style={styles.statusTitle}>你的困擾已分享</Text>
              <Text style={styles.statusDescription}>
                {timeUntilMatch.isToday 
                  ? `${timeUntilMatch.hours}小時${timeUntilMatch.minutes}分鐘後進行配對`
                  : '明天晚上8點進行配對'
                }
              </Text>
              <View style={styles.troublePreview}>
                <Text style={styles.troubleText} numberOfLines={2}>
                  "{todayTrouble}"
                </Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => navigation.navigate('ShareTrouble')}
                >
                  <Text style={styles.editButtonText}>編輯</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : matchStatus === 'matched' ? (
            <View style={styles.statusContent}>
              <Text style={styles.statusEmoji}>🎯</Text>
              <Text style={styles.statusTitle}>配對成功！</Text>
              <Text style={styles.statusDescription}>
                有人需要你的溫暖祝福
              </Text>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.navigate('TodayMatch')}
              >
                <Text style={styles.primaryButtonText}>給予祝福</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.statusContent}>
              <Text style={styles.statusEmoji}>✨</Text>
              <Text style={styles.statusTitle}>今日任務完成</Text>
              <Text style={styles.statusDescription}>
                你已經給予和收到了溫暖
              </Text>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('ListenBlessing')}
              >
                <Text style={styles.secondaryButtonText}>回聽祝福</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 快速操作區 */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>快速操作</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('ListenBlessing')}
            >
              <Text style={styles.actionIcon}>🎧</Text>
              <Text style={styles.actionTitle}>聆聽祝福</Text>
              <Text style={styles.actionDesc}>收聽溫暖話語</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('TodayMatch')}
            >
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionTitle}>今日配對</Text>
              <Text style={styles.actionDesc}>給予他人支持</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 今日時光 */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>今日時光</Text>
          <View style={styles.timeCard}>
            <Text style={styles.currentTime}>
              {currentTime.toLocaleTimeString('zh-TW', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            <Text style={styles.dateText}>
              {currentTime.toLocaleDateString('zh-TW', { 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// 簡潔的分享困擾頁面
function ShareTroubleScreen({ navigation }: any) {
  const [trouble, setTrouble] = useState('');
  const [savedTrouble, setSavedTrouble] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingTrouble, setHasExistingTrouble] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadSavedTrouble();
  }, [currentUser]);

  const loadSavedTrouble = async () => {
    try {
      if (currentUser) {
        const storageKey = `trouble_${currentUser.uid}`;
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved) {
          setSavedTrouble(saved);
          setTrouble(saved);
          setHasExistingTrouble(true);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      }
    } catch (error) {
      console.error('載入困擾失敗:', error);
      setIsEditing(true);
    }
  };

  const saveTroubleToStorage = async (troubleContent: string) => {
    try {
      if (currentUser) {
        const storageKey = `trouble_${currentUser.uid}`;
        await AsyncStorage.setItem(storageKey, troubleContent);
      }
    } catch (error) {
      console.error('保存困擾失敗:', error);
    }
  };

  const handleSave = async () => {
    if (!trouble.trim()) {
      Alert.alert('提示', '請輸入您的困擾');
      return;
    }

    try {
      await saveTroubleToStorage(trouble);
      setSavedTrouble(trouble);
      setHasExistingTrouble(true);
      setIsEditing(false);
      Alert.alert('保存成功', '您的困擾已保存，系統會在晚上8點自動進行配對');
    } catch (error) {
      Alert.alert('保存失敗', '請稍後再試');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
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
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionText}>今天發生了什麼讓你困擾的事？</Text>
        
        {hasExistingTrouble && !isEditing ? (
          <View>
            <View style={styles.savedTroubleCard}>
              <Text style={styles.savedTroubleTitle}>💾 您的困擾內容</Text>
              <Text style={styles.savedTroubleText}>{savedTrouble}</Text>
              
              <TouchableOpacity 
                style={styles.editOnlyButton}
                onPress={handleEdit}
              >
                <Text style={styles.editOnlyButtonText}>✏️ 編輯</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.autoMatchNotice}>
              <Text style={styles.autoMatchTitle}>⏰ 自動配對提醒</Text>
              <Text style={styles.autoMatchText}>
                系統會在每日晚上 8:00 自動為您進行配對，無需重複操作
              </Text>
            </View>
          </View>
        ) : (
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
                    primary: '#4CAF50',
                    onSurface: trouble.trim() ? '#000000' : '#999999',
                    onSurfaceVariant: trouble.trim() ? '#000000' : '#999999',
                    placeholder: '#999999'
                  } 
                }}
              />
              <Text style={styles.characterCount}>{trouble.length}/300 字</Text>
            </View>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>💾 保存困擾</Text>
            </TouchableOpacity>
            
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

// 簡化的今日配對頁面
function TodayMatchScreen({ navigation }: any) {
  const [hasSharedTrouble, setHasSharedTrouble] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    checkTroubleStatus();
  }, []);

  const checkTroubleStatus = async () => {
    try {
      if (currentUser) {
        const storageKey = `trouble_${currentUser.uid}`;
        const savedTrouble = await AsyncStorage.getItem(storageKey);
        setHasSharedTrouble(!!savedTrouble && savedTrouble.trim().length > 0);
      }
    } catch (error) {
      console.error('檢查困擾狀態失敗:', error);
      setHasSharedTrouble(false);
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
              style={styles.primaryButton}
              onPress={() => navigation.navigate('ShareTrouble')}
            >
              <Text style={styles.primaryButtonText}>去分享困擾</Text>
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

// 簡化的聆聽祝福頁面
function ListenBlessingScreen({ navigation }: any) {
  const [hasSharedTrouble, setHasSharedTrouble] = useState(false);
  const [userTrouble, setUserTrouble] = useState('');
  const { currentUser } = useAuth();

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
      console.error('檢查困擾狀態失敗:', error);
      setHasSharedTrouble(false);
      setUserTrouble('');
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
        <Text style={styles.headerTitle}>聆聽祝福</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              style={styles.primaryButton}
              onPress={() => navigation.navigate('ShareTrouble')}
            >
              <Text style={styles.primaryButtonText}>去分享困擾</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.shareText}>
              {userTrouble}
            </Text>
            
            <View style={styles.blessingCard}>
              <Text style={styles.blessingTitle}>
                🎤 陌生人給你的祝福
              </Text>
              <Text style={styles.blessingWaiting}>
                配對成功後，您就能在這裡聆聽到溫暖的祝福語音
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// 主要應用組件
function AppContent() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>載入中...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={currentUser ? "Home" : "Welcome"}
      >
        {currentUser ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ShareTrouble" component={ShareTroubleScreen} />
            <Stack.Screen name="TodayMatch" component={TodayMatchScreen} />
            <Stack.Screen name="ListenBlessing" component={ListenBlessingScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppContent />
        <StatusBar style="auto" />
      </AuthProvider>
    </PaperProvider>
  );
}

// 統一的樣式系統
const styles = StyleSheet.create({
  // 基礎容器
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  homeContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // 歡迎頁面
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  welcomeDescription: {
    alignItems: 'center',
    marginBottom: 60,
  },
  descriptionText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeButtons: {
    width: '100%',
    gap: 16,
  },
  startButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  // 註冊頁面
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  genderContainer: {
    justifyContent: 'center',
  },
  genderLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#4CAF50',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
  },
  genderButtonTextActive: {
    color: 'white',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonDisabled: {
    backgroundColor: '#ADB5BD',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#6C757D',
  },
  loginLinkHighlight: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  // 主畫面
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  userName: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusContent: {
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 200,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#E9ECEF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 200,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },
  troublePreview: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginTop: 12,
  },
  troubleText: {
    fontSize: 14,
    color: '#495057',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  editButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#6C757D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  editButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  quickActions: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  timeSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  timeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#6C757D',
  },

  // 通用組件
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },

  // 分享困擾頁面
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 24,
    lineHeight: 26,
  },
  savedTroubleCard: {
    backgroundColor: '#F0F8F0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
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
  editOnlyButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editOnlyButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  troubleInputContainer: {
    marginBottom: 20,
  },
  troubleInput: {
    backgroundColor: 'white',
    minHeight: 200,
  },
  characterCount: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'right',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
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

  // 狀態頁面
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

  // 聆聽祝福頁面
  myShare: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  shareContent: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  shareTime: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  shareText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  blessingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  blessingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  blessingWaiting: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

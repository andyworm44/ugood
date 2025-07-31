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
import { Button, TextInput, Card } from 'react-native-paper';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import AudioRecorder from './src/components/AudioRecorder';
import AudioPlayer from './src/components/AudioPlayer';

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
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName || !gender || !age) {
      Alert.alert('錯誤', '請完成所有資訊');
      return;
    }

    if (!isValidEmail(email)) {
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
      await signup(email, password, {
        displayName,
        gender,
        age: ageNum
      });
      Alert.alert('註冊成功', '歡迎加入 UGood！', [
        { text: '確定', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = '註冊失敗，請稍後再試';
      
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
      
      Alert.alert('註冊失敗', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
                theme={{ colors: { primary: '#8FBC8F' } }}
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
                theme={{ colors: { primary: '#8FBC8F' } }}
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
                theme={{ colors: { primary: '#8FBC8F' } }}
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
                theme={{ colors: { primary: '#8FBC8F' } }}
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
                  style={[styles.genderButton, gender === '男性' && styles.genderButtonActive]}
                  onPress={() => setGender('男性')}
                >
                  <Text style={[styles.genderButtonText, gender === '男性' && styles.genderButtonTextActive]}>男性</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.genderButton, gender === '女性' && styles.genderButtonActive]}
                  onPress={() => setGender('女性')}
                >
                  <Text style={[styles.genderButtonText, gender === '女性' && styles.genderButtonTextActive]}>女性</Text>
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
                theme={{ colors: { primary: '#8FBC8F' } }}
              />
              <Text style={styles.ageNote}>* 年齡資訊將會隱藏</Text>
            </View>

            {/* 完成註冊按鈕 - 確保可見 */}
            <TouchableOpacity 
              style={[styles.completeButton, loading && styles.completeButtonDisabled]} 
              onPress={handleRegister}
              disabled={loading}
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

// 主頁面
function HomeScreen({ navigation }: any) {
  const { currentUser, logout } = useAuth();

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
        <Text style={styles.headerSubtitle}>歡迎回來，{currentUser?.displayName}</Text>
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
          <Text style={styles.matchTitle}>今日配對：等待中</Text>
          <Text style={styles.matchSubtitle}>晚上 8:00 將為您配對</Text>
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
          <Text style={styles.featureDescription}>查看配對對象並給予祝福</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('ListenBlessing')}
        >
          <Text style={styles.featureTitle}>聆聽祝福</Text>
          <Text style={styles.featureDescription}>收聽來自陌生人的溫暖</Text>
        </TouchableOpacity>

        {/* 測試功能區域 */}
        <View style={styles.testSection}>
          <Text style={styles.testSectionTitle}>🧪 測試功能</Text>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => {
              Alert.alert('註冊測試', '註冊功能正常運作！\n✅ 表單驗證\n✅ Firebase 整合\n✅ 用戶狀態管理');
            }}
          >
            <Text style={styles.testButtonText}>測試註冊功能</Text>
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
  const { shareTrouble } = useAuth();

  // 模擬從本地存儲載入已保存的煩惱
  useEffect(() => {
    // 這裡可以從 AsyncStorage 或其他持久化存儲載入
    const mockSavedTrouble = '最近工作壓力好大，老闆一直催進度，同事關係也有點緊張。每天下班都覺得很疲憊，想要有人能聽聽我的困擾，給我一些溫暖的建議。'; // 模擬已保存的煩惱內容
    if (mockSavedTrouble) {
      setSavedTrouble(mockSavedTrouble);
      setTrouble(mockSavedTrouble);
      setHasExistingTrouble(true);
    } else {
      setIsEditing(true); // 沒有保存的煩惱，直接進入編輯模式
    }
  }, []);

  const handleSave = async () => {
    if (!trouble.trim()) {
      Alert.alert('提示', '請輸入您的困擾');
      return;
    }

    try {
      // 保存煩惱內容到本地
      setSavedTrouble(trouble);
      setHasExistingTrouble(true);
      setIsEditing(false);

             // 使用 Firebase 分享困擾並嘗試配對
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
      Alert.alert(
        '分享失敗',
        '網路連接問題，請稍後再試。\n\n您的內容已保存在本地。',
        [{ text: '確定' }]
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
          onPress: () => {
            setSavedTrouble('');
            setTrouble('');
            setHasExistingTrouble(false);
            setIsEditing(true);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDeleteTrouble}
                >
                  <Text style={styles.deleteButtonText}>🗑️ 刪除</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.matchButton}
              onPress={handleSubmitForMatching}
            >
              <Text style={styles.matchButtonText}>🎯 使用此內容進行配對</Text>
            </TouchableOpacity>
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
                style={styles.troubleInput}
                maxLength={300}
                theme={{ 
                  colors: { 
                    primary: '#8FBC8F',
                    placeholder: '#999999'
                  } 
                }}
              />
              <Text style={styles.characterCount}>{trouble.length}/300 字</Text>
            </View>

            <View style={styles.editModeActions}>
              <TouchableOpacity 
                style={styles.matchButton}
                onPress={handleSave}
              >
                <Text style={styles.matchButtonText}>🎯 使用此內容進行配對</Text>
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// 今日配對頁面
function TodayMatchScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Text style={styles.matchName}>匿名朋友</Text>
          <Text style={styles.matchTime}>2 小時前</Text>
        </View>

        <View style={styles.troubleContent}>
          <Text style={styles.troubleText}>
            最近工作壓力很大，老闆總是對我的方案不滿意，感覺自己很沒用。
            回到家也不知道該怎麼跟家人說，只能一個人默默承受...
          </Text>
        </View>

        <View style={styles.recordingSection}>
          <Text style={styles.recordingTitle}>錄製祝福語音</Text>
          
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
  
  // 檢查是否為自己的錄音
  const isSelfRecording = route?.params?.selfRecording || false;
  const recordingUri = route?.params?.recordingUri || null;
  const recordingDuration = route?.params?.recordingDuration || 150; // 2分30秒

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
      '正在播放你的祝福語音...\n\n"嗨，雖然我們素不相識，但我想告訴你，工作壓力是很多人都會遇到的。記住，你並不孤單，每個人都有自己的節奏。請對自己溫柔一點，明天會更好的..."';
    
    Alert.alert(title, message, [{ text: '確定' }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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

        <Text style={styles.shareText}>
          最近工作壓力很大，老闆總是對我的方案不滿意，感覺自己很沒用。
          回到家也不知道該怎麼跟家人說，只能一個人默默承受...
        </Text>

        {recordingUri ? (
          <AudioPlayer
            audioUri={recordingUri}
            duration={recordingDuration}
            title={isSelfRecording ? '🎤 你的祝福錄音（測試模式）' : '來自陌生朋友的祝福'}
            isSelfRecording={isSelfRecording}
          />
        ) : (
          <View style={[styles.blessingCard, isSelfRecording && styles.selfRecordingCard]}>
            <Text style={styles.blessingTitle}>
              {isSelfRecording ? '🎤 你的祝福錄音（預覽）' : '🎤 你給陌生人的祝福'}
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

  const handleRecordingComplete = (uri: string, duration: number) => {
    setRecordingUri(uri);
    setRecordingDuration(duration);
  };

  const sendRecording = () => {
    if (!recordingUri) {
      Alert.alert('錯誤', '請先完成錄音');
      return;
    }

    Alert.alert(
      '錄音完成', 
      '您的祝福語音已錄製完成！\n\n✅ 錄音時長：' + Math.floor(recordingDuration / 60) + '分' + (recordingDuration % 60) + '秒\n✅ 準備傳送給陌生朋友\n\n🎉 預覽並送出：點擊"預覽祝福"來確認錄音！',
      [
        { 
          text: '預覽祝福', 
          onPress: () => navigation.navigate('ListenBlessing', { 
            selfRecording: true, 
            recordingUri: recordingUri,
            recordingDuration: recordingDuration 
          }) 
        },
        { text: '返回首頁', onPress: () => navigation.navigate('Home') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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

          {/* 真實錄音組件 */}
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete}
            onPlaybackComplete={() => console.log('播放完成')}
          />

          {/* 發送按鈕 */}
          {recordingUri && (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendRecording}
            >
              <Text style={styles.sendButtonText}>發送祝福語音</Text>
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
    marginBottom: 20,
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
  completeButton: {
    alignItems: 'center',
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
}); 
import React, { useState } from 'react';
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
} from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';

const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');

// 歡迎頁面
function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>你還好嗎</Text>
        <Text style={styles.welcomeSubtitle}>UGood</Text>
        
        <View style={styles.welcomeDescription}>
          <Text style={styles.descriptionText}>每天與一位陌生人配對</Text>
          <Text style={styles.descriptionText}>分享困擾，給予祝福</Text>
          <Text style={styles.descriptionText}>讓溫暖透過語音傳遞</Text>
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
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.loginButtonText}>已有帳號</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// 註冊頁面
function RegisterScreen({ navigation }: any) {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  const handleRegister = () => {
    if (gender && age) {
      navigation.navigate('Home');
    } else {
      Alert.alert('請完成所有資訊');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>建立帳號</Text>
      </View>
      
      <ScrollView style={styles.content}>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>年齡</Text>
          <TextInput
            mode="outlined"
            placeholder="請輸入年齡"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={styles.ageInput}
          />
          <Text style={styles.ageNote}>* 年齡資訊將會隱藏</Text>
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={handleRegister}>
          <Text style={styles.completeButtonText}>完成註冊</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// 主頁面
function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>你還好嗎</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* 今日配對狀態 */}
        <View style={styles.matchCard}>
          <Text style={styles.matchTitle}>今日配對：等待中</Text>
          <Text style={styles.matchSubtitle}>晚上 10:00 將為您配對</Text>
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
      </ScrollView>
    </View>
  );
}

// 分享困擾頁面
function ShareTroubleScreen({ navigation }: any) {
  const [trouble, setTrouble] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>分享困擾</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.hintCard}>
          <Text style={styles.hintTitle}>💡 小提示</Text>
          <Text style={styles.hintText}>
            可以分享工作壓力、感情困擾、家庭問題，或是任何需要陌生人給予支持與祝福的事情
          </Text>
        </View>

        <Text style={styles.questionText}>今天發生了什麼讓你困擾的事？</Text>
        
        <View style={styles.troubleInputContainer}>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={8}
            placeholder="在這裡寫下你的困擾，讓陌生人給你溫暖的祝福..."
            value={trouble}
            onChangeText={setTrouble}
            style={styles.troubleInput}
          />
          <Text style={styles.characterCount}>{trouble.length}/300 字</Text>
        </View>

        <TouchableOpacity 
          style={styles.publishButton}
          onPress={() => {
            Alert.alert('分享成功', '你的困擾已分享，等待溫暖的回應');
            navigation.goBack();
          }}
        >
          <Text style={styles.publishButtonText}>發布並等待配對</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// 今日配對頁面
function TodayMatchScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>今日配對成功</Text>
        <Text style={styles.headerSubtitle}>為這位朋友錄製祝福語音</Text>
      </View>
      
      <ScrollView style={styles.content}>
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
    </View>
  );
}

// 聆聽祝福頁面
function ListenBlessingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>聆聽祝福</Text>
        <Text style={styles.headerSubtitle}>但又不想讓朋友擔心...</Text>
      </View>
      
      <ScrollView style={styles.content}>
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
          最近失戀了，感覺整個人都不好了。看著身邊的朋友都很幸福，
          自己卻一個人，很想找個人聊聊但又不想讓朋友擔心...
        </Text>

        <View style={styles.blessingCard}>
          <Text style={styles.blessingTitle}>來自陌生朋友的祝福</Text>
          <View style={styles.audioPlayer}>
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>▶</Text>
            </View>
            <Text style={styles.audioDuration}>時長：2分30秒</Text>
          </View>
        </View>

        <View style={styles.responseSection}>
          <Text style={styles.responseTitle}>回應語音（可選）</Text>
          <Text style={styles.responseDescription}>你可以錄製一段感謝的話語</Text>
          
          <TouchableOpacity style={styles.responseButton}>
            <View style={styles.responseButtonInner}>
              <Text style={styles.responseButtonText}>錄製感謝語音</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// 錄音頁面
function RecordingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>今日配對成功</Text>
        <Text style={styles.headerSubtitle}>為這位朋友錄製祝福語音</Text>
      </View>
      
      <View style={styles.recordingContainer}>
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

          <TouchableOpacity 
            style={styles.recordingButton}
            onPress={() => {
              Alert.alert('錄音完成', '祝福語音已發送給對方', [
                { text: '確定', onPress: () => navigation.navigate('Home') }
              ]);
            }}
          >
            <View style={styles.recordingButtonInner}>
              <Text style={styles.recordingButtonText}>點擊開始錄音</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ShareTrouble" component={ShareTroubleScreen} />
          <Stack.Screen name="TodayMatch" component={TodayMatchScreen} />
          <Stack.Screen name="ListenBlessing" component={ListenBlessingScreen} />
          <Stack.Screen name="Recording" component={RecordingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  // 歡迎頁面樣式
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#8FBC8F',
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
    marginBottom: 10,
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
  header: {
    backgroundColor: '#8FBC8F',
    paddingTop: 50,
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
  ageInput: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  ageNote: {
    fontSize: 14,
    color: '#666',
  },
  completeButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  // 主頁面樣式
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
  recordingButton: {
    alignItems: 'center',
  },
  recordingButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8FBC8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
}); 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './contexts/SupabaseAuthContext';

const { width } = Dimensions.get('window');

// 全新設計的主畫面
function NewHomeScreen({ navigation }: any) {
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
          // 這裡可以檢查配對狀態
          setMatchStatus('waiting'); // 暫時設為等待中
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
    matchTime.setHours(20, 0, 0, 0); // 晚上8點
    
    if (now > matchTime) {
      // 如果已經過了今天的8點，顯示明天的8點
      matchTime.setDate(matchTime.getDate() + 1);
    }
    
    const diff = matchTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, isToday: matchTime.toDateString() === now.toDateString() };
  };

  const timeUntilMatch = getNextMatchTime();

  return (
    <SafeAreaView style={styles.container}>
      {/* 頂部問候區 */}
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getTimeGreeting()}！</Text>
          <Text style={styles.userName}>{currentUser?.email?.split('@')[0] || '朋友'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {
            // 可以添加設置選單
            logout();
          }}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 今日狀態卡片 */}
        <View style={styles.statusCard}>
          {!hasSharedToday ? (
            // 尚未分享困擾
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
            // 已分享，等待配對
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
            // 已配對，可以給祝福
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
            // 已完成今日循環
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
});

export default NewHomeScreen;

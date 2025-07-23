import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Divider,
} from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../App';

interface UserData {
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      '確認登出',
      '您確定要登出嗎？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '登出',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('錯誤', '登出失敗');
            }
          },
        },
      ]
    );
  };

  const user = auth.currentUser;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>載入中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={userData?.name?.charAt(0) || 'U'}
          style={styles.avatar}
        />
        <Title style={styles.name}>{userData?.name || '用戶'}</Title>
        <Paragraph style={styles.email}>{userData?.email}</Paragraph>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>帳號資訊</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>姓名：</Text>
              <Text style={styles.value}>{userData?.name || '未設定'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>電子郵件：</Text>
              <Text style={styles.value}>{userData?.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>註冊日期：</Text>
              <Text style={styles.value}>
                {userData?.createdAt 
                  ? new Date(userData.createdAt).toLocaleDateString('zh-TW')
                  : '未知'
                }
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>統計資料</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>貼文</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>點讚</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>留言</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.signOutButton}
          textColor="#FF3B30"
        >
          登出
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    paddingVertical: 30,
    paddingTop: 60,
  },
  avatar: {
    backgroundColor: '#0056CC',
  },
  name: {
    color: 'white',
    marginTop: 10,
    fontSize: 24,
  },
  email: {
    color: 'white',
    opacity: 0.8,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  value: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  signOutButton: {
    marginTop: 20,
    borderColor: '#FF3B30',
  },
}); 
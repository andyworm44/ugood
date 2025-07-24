import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  List,
  Switch,
  Divider,
  Card,
  Title,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    // TODO: 實際的通知設定邏輯
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // TODO: 實際的深色模式切換邏輯
  };

  const handleLocationToggle = () => {
    setLocationSharing(!locationSharing);
    // TODO: 實際的位置分享設定邏輯
  };

  const handleAbout = () => {
    Alert.alert(
      '關於 UGood',
      'UGood v1.0.0\n\n一個簡潔優雅的社交應用\n\n© 2024 UGood Team'
    );
  };

  const handlePrivacy = () => {
    Alert.alert('隱私政策', '隱私政策內容...');
  };

  const handleTerms = () => {
    Alert.alert('使用條款', '使用條款內容...');
  };

  const handleFeedback = () => {
    Alert.alert('意見回饋', '感謝您的意見回饋！');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
        <Title style={styles.headerTitle}>設定</Title>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>一般設定</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="推播通知"
            description="接收新訊息和更新通知"
            left={() => <List.Icon icon="bell-outline" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={handleNotificationToggle}
              />
            )}
          />

          <List.Item
            title="深色模式"
            description="使用深色主題"
            left={() => <List.Icon icon="weather-night" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
              />
            )}
          />

          <List.Item
            title="位置分享"
            description="允許分享您的位置資訊"
            left={() => <List.Icon icon="map-marker-outline" />}
            right={() => (
              <Switch
                value={locationSharing}
                onValueChange={handleLocationToggle}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>帳號</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="編輯個人資料"
            description="修改您的個人資訊"
            left={() => <List.Icon icon="account-edit-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: 導航到編輯個人資料畫面
              Alert.alert('功能開發中', '此功能正在開發中');
            }}
          />

          <List.Item
            title="隱私設定"
            description="管理您的隱私偏好"
            left={() => <List.Icon icon="shield-account-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: 導航到隱私設定畫面
              Alert.alert('功能開發中', '此功能正在開發中');
            }}
          />

          <List.Item
            title="更改密碼"
            description="更新您的登入密碼"
            left={() => <List.Icon icon="lock-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {
              // TODO: 導航到更改密碼畫面
              Alert.alert('功能開發中', '此功能正在開發中');
            }}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>支援</Title>
          <Divider style={styles.divider} />

          <List.Item
            title="意見回饋"
            description="告訴我們您的想法"
            left={() => <List.Icon icon="message-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={handleFeedback}
          />

          <List.Item
            title="隱私政策"
            description="了解我們如何保護您的隱私"
            left={() => <List.Icon icon="file-document-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={handlePrivacy}
          />

          <List.Item
            title="使用條款"
            description="服務使用條款"
            left={() => <List.Icon icon="file-document-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={handleTerms}
          />

          <List.Item
            title="關於"
            description="應用程式資訊"
            left={() => <List.Icon icon="information-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={handleAbout}
          />
        </Card.Content>
      </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
  },
}); 
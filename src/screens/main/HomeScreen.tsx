import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, FAB } from 'react-native-paper';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebase.config';
import PostCard from '../../components/PostCard';
import { Post } from '../../types';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // 監聽貼文資料變化
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: Post[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({
          id: doc.id,
          ...doc.data(),
        } as Post);
      });
      setPosts(postsData);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          歡迎回來, {user?.displayName || '用戶'}！
        </Text>
        <Text style={styles.subtitle}>今天有什麼新鮮事嗎？</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>暫無貼文</Title>
              <Paragraph>成為第一個分享的人吧！</Paragraph>
            </Card.Content>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => {
                // TODO: 導航到貼文詳情頁面
                console.log('View post:', post.id);
              }}
              onLike={() => {
                // TODO: 點讚功能
                console.log('Like post:', post.id);
              }}
              onComment={() => {
                // TODO: 評論功能
                console.log('Comment on post:', post.id);
              }}
              onShare={() => {
                // TODO: 分享功能
                console.log('Share post:', post.id);
              }}
            />
          ))
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreatePost')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    padding: 16,
  },
  emptyCard: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
}); 
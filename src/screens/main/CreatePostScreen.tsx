import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Appbar,
} from 'react-native-paper';
import { postService } from '../../services/firebase';
import { validatePostForm } from '../../utils/validation';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../utils/constants';

interface CreatePostScreenProps {
  navigation: any;
}

export default function CreatePostScreen({ navigation }: CreatePostScreenProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    // 驗證表單
    const validation = validatePostForm(title, content);
    if (!validation.isValid) {
      Alert.alert('輸入錯誤', validation.errors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      const result = await postService.createPost({
        title: title.trim(),
        content: content.trim(),
      });

      if (result.success) {
        Alert.alert('成功', SUCCESS_MESSAGES.POST_CREATED, [
          {
            text: '確定',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('錯誤', ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('錯誤', ERROR_MESSAGES.NETWORK_ERROR);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="發布新貼文" />
        <Appbar.Action
          icon="check"
          onPress={handleCreatePost}
          disabled={loading}
        />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="標題"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={styles.input}
                maxLength={100}
                placeholder="請輸入貼文標題..."
              />

              <TextInput
                label="內容"
                value={content}
                onChangeText={setContent}
                mode="outlined"
                multiline
                numberOfLines={8}
                style={styles.textArea}
                maxLength={1000}
                placeholder="分享您的想法..."
              />

              <View style={styles.characterCount}>
                <Text style={styles.countText}>
                  標題: {title.length}/100
                </Text>
                <Text style={styles.countText}>
                  內容: {content.length}/1000
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleCreatePost}
            loading={loading}
            style={styles.submitButton}
            disabled={!title.trim() || !content.trim()}
          >
            發布貼文
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 2,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    marginBottom: 8,
    minHeight: 120,
  },
  characterCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  countText: {
    fontSize: 12,
    color: '#666',
  },
  submitButton: {
    marginVertical: 16,
    paddingVertical: 8,
  },
}); 
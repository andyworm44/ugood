import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  IconButton,
} from 'react-native-paper';
import { Post } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export default function PostCard({
  post,
  onPress,
  onLike,
  onComment,
  onShare,
}: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}天前`;
    } else if (hours > 0) {
      return `${hours}小時前`;
    } else {
      return '剛剛';
    }
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card.Content>
          <View style={styles.header}>
            <Avatar.Text
              size={40}
              label={post.authorName.charAt(0)}
              style={styles.avatar}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.authorName}</Text>
              <Text style={styles.timestamp}>
                {formatDate(post.createdAt)}
              </Text>
            </View>
          </View>

          <Title style={styles.title}>{post.title}</Title>
          <Paragraph style={styles.content} numberOfLines={3}>
            {post.content}
          </Paragraph>
        </Card.Content>
      </TouchableOpacity>

      <Card.Actions style={styles.actions}>
        <View style={styles.actionButton}>
          <IconButton
            icon="heart-outline"
            size={20}
            onPress={onLike}
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </View>

        <View style={styles.actionButton}>
          <IconButton
            icon="comment-outline"
            size={20}
            onPress={onComment}
          />
          <Text style={styles.actionText}>{post.comments?.length || 0}</Text>
        </View>

        <View style={styles.actionButton}>
          <IconButton
            icon="share-outline"
            size={20}
            onPress={onShare}
          />
        </View>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.MD,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  avatar: {
    backgroundColor: COLORS.PRIMARY,
  },
  authorInfo: {
    marginLeft: SPACING.SM,
    flex: 1,
  },
  authorName: {
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  timestamp: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY,
  },
  title: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    marginBottom: SPACING.XS,
    color: COLORS.BLACK,
  },
  content: {
    fontSize: FONT_SIZES.MD,
    lineHeight: 20,
    color: COLORS.BLACK,
  },
  actions: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  actionText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY,
    marginLeft: -SPACING.XS,
  },
}); 
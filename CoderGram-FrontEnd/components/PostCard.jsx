import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform } from 'react-native';
import { IconButton, Avatar } from 'react-native-paper';
import client from '../api/client';
import { formatDistanceToNow } from 'date-fns';
import { API_BASE } from '../config';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400';
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${API_BASE.replace('/api', '')}/${cleanPath}`;
};

export default function PostCard({ post, onOpenComments, onLikeChanged }) {
  const [liked, setLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const toggleLike = async () => {
    setLiked(prev => !prev);
    setLikesCount(prev => prev + (liked ? -1 : 1));
    try {
      await client.put(`/posts/${post._id}/like`);
      onLikeChanged && onLikeChanged(post._id, !liked);
    } catch (err) {
      setLiked(prev => !prev);
      setLikesCount(prev => prev + (liked ? 1 : -1));
      console.log('Like error', err);
    }
  };

  const author = post.author || {};
  const avatarUrl = getImageUrl(author.profilePicture);
  const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar.Image size={32} source={{ uri: avatarUrl }} />
          <Text style={styles.username}>{author.username || 'Unknown'}</Text>
        </View>
        <IconButton icon="dots-horizontal" size={20} />
      </View>

      {post.image ? (
        <Image source={{ uri: getImageUrl(post.image) }} style={styles.image} resizeMode="cover" />
      ) : post.code ? (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLanguage}>{post.language || 'Code'}</Text>
          <Text style={styles.codeText}>{post.code}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={toggleLike}>
            <IconButton
              icon={liked ? 'heart' : 'heart-outline'}
              size={24}
              iconColor={liked ? '#ff3040' : 'black'}
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onOpenComments(post)}>
            <IconButton icon="comment-outline" size={22} style={styles.actionIcon} />
          </TouchableOpacity>
          <IconButton icon="send-outline" size={22} style={styles.actionIcon} />
        </View>
        <IconButton icon="bookmark-outline" size={24} style={styles.actionIcon} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.likes}>{likesCount} likes</Text>
        <View style={styles.captionContainer}>
          <Text style={styles.captionUsername}>{author.username}</Text>
          <Text style={styles.captionText}> {post.caption}</Text>
        </View>
        {post.commentsCount > 0 && (
          <TouchableOpacity onPress={() => onOpenComments(post)}>
            <Text style={styles.viewComments}>View all {post.commentsCount} comments</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.time}>{timeAgo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: 400,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    margin: 0,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  likes: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  captionUsername: {
    fontWeight: 'bold',
  },
  captionText: {
    lineHeight: 18,
  },
  viewComments: {
    color: 'gray',
    marginBottom: 5,
  },
  time: {
    color: 'gray',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  codeContainer: {
    width: '100%',
    minHeight: 200,
    backgroundColor: '#1e1e1e',
    padding: 15,
    justifyContent: 'center',
  },
  codeText: {
    color: '#e0e0e0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  codeLanguage: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Pressable } from 'react-native';
import { Card, Avatar, IconButton, Text, Chip } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:8000/api';

const PostCard = ({ post, onCommentPress }) => {
  const { userToken } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiking, setIsLiking] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(0)).current;

  const isLiked = likes.some(like => like === userToken);

  const handleLike = async () => {
    if (isLiking) return;
    
    // Optimistic UI update
    const wasLiked = isLiked;
    const newLikes = wasLiked 
      ? likes.filter(like => like !== userToken)
      : [...likes, userToken];
    setLikes(newLikes);
    
    // Animate button press
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        useNativeDriver: true,
        friction: 3,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      })
    ]).start();

    // Animate heart pop if liking
    if (!wasLiked) {
      Animated.sequence([
        Animated.spring(heartAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 4,
        }),
        Animated.timing(heartAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }
    
    setIsLiking(true);
    try {
      const response = await fetch(`${API_URL}/posts/${post._id}/like`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
      } else {
        // Revert on error
        setLikes(wasLiked ? [...likes, userToken] : likes.filter(like => like !== userToken));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      setLikes(wasLiked ? [...likes, userToken] : likes.filter(like => like !== userToken));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card style={styles.card} elevation={0}>
      {/* Header */}
      <Card.Title
        title={post.author?.username || 'Unknown User'}
        titleStyle={styles.username}
        left={(props) => (
          <View style={styles.avatarContainer}>
            {post.author?.profilePicture ? (
              <Avatar.Image
                {...props}
                size={40}
                source={{ uri: post.author.profilePicture }}
              />
            ) : (
              <Avatar.Text
                {...props}
                size={40}
                label={(post.author?.username || 'U').charAt(0).toUpperCase()}
                style={styles.avatarGradient}
              />
            )}
          </View>
        )}
      />
      
      {/* Caption */}
      {post.caption && (
        <Card.Content style={styles.captionContainer}>
          <Text variant="bodyMedium" style={styles.caption}>
            <Text style={styles.captionUsername}>{post.author?.username}</Text> {post.caption}
          </Text>
        </Card.Content>
      )}

      {/* Code Block */}
      <Card.Content style={styles.codeContainer}>
        <View style={styles.codeHeader}>
          <Chip 
            icon="code-tags" 
            mode="flat" 
            style={styles.languageChip}
            textStyle={styles.languageText}
          >
            {post.language || 'code'}
          </Chip>
        </View>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText} selectable>{post.code}</Text>
        </View>
      </Card.Content>

      {/* Actions with Animation */}
      <Card.Actions style={styles.actions}>
        <View style={styles.leftActions}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable onPress={handleLike} disabled={isLiking}>
              <View style={styles.actionButton}>
                <IconButton
                  icon={isLiked ? 'heart' : 'heart-outline'}
                  iconColor={isLiked ? '#ff3366' : '#fff'}
                  size={28}
                  style={styles.iconButton}
                />
              </View>
            </Pressable>
          </Animated.View>
          
          <Pressable onPress={() => onCommentPress && onCommentPress(post)}>
            <View style={styles.actionButton}>
              <IconButton
                icon="comment-outline"
                iconColor="#fff"
                size={28}
                style={styles.iconButton}
              />
            </View>
          </Pressable>
          
          <IconButton
            icon="share-variant-outline"
            iconColor="#fff"
            size={28}
            style={styles.iconButton}
          />
        </View>
        
        <IconButton
          icon="bookmark-outline"
          iconColor="#fff"
          size={28}
          style={styles.iconButton}
        />
      </Card.Actions>

      {/* Like Count */}
      <Card.Content style={styles.likesContainer}>
        <Text variant="bodyMedium" style={styles.likesText}>
          {likes.length > 0 && (
            <Text style={styles.boldText}>
              {likes.length} {likes.length === 1 ? 'like' : 'likes'}
            </Text>
          )}
        </Text>
        {post.commentCount > 0 && (
          <Text variant="bodySmall" style={styles.viewComments}>
            View all {post.commentCount} comments
          </Text>
        )}
      </Card.Content>

      {/* Animated Heart Overlay */}
      <Animated.View 
        style={[
          styles.heartOverlay,
          {
            opacity: heartAnim,
            transform: [
              { scale: heartAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1.5]
              })}
            ]
          }
        ]}
        pointerEvents="none"
      >
        <IconButton
          icon="heart"
          iconColor="#ff3366"
          size={80}
        />
      </Animated.View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#000',
    borderRadius: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  avatarContainer: {
    padding: 2,
    borderRadius: 50,
    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
  },
  avatarGradient: {
    backgroundColor: '#6200ee',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  captionContainer: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  caption: {
    color: '#fff',
    lineHeight: 18,
  },
  captionUsername: {
    fontWeight: 'bold',
    color: '#fff',
  },
  codeContainer: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  codeHeader: {
    marginBottom: 8,
  },
  languageChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#6200ee',
    height: 28,
  },
  languageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  codeBlock: {
    backgroundColor: '#0d1117',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  codeText: {
    fontFamily: 'Courier',
    color: '#c9d1d9',
    fontSize: 13,
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionButton: {
    marginRight: -8,
  },
  iconButton: {
    margin: 0,
  },
  likesContainer: {
    paddingTop: 0,
    paddingBottom: 12,
  },
  likesText: {
    color: '#fff',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  viewComments: {
    color: '#888',
    marginTop: 4,
  },
  heartOverlay: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
  },
});

export default React.memo(PostCard);

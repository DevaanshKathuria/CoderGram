import React, { useState, useContext, useEffect } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, IconButton, List, Avatar, ActivityIndicator, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const API_URL = 'http://localhost:8000/api';

const CommentsScreen = ({ route }) => {
  const { postId } = route.params;
  const { userToken } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/comments/post/${postId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const data = await response.json();

      if (response.ok) {
        setComments(data);
      } else {
        showSnackbar(data.message || 'Failed to fetch comments.');
      }
    } catch (error) {
      showSnackbar('Network error. Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      showSnackbar('Comment cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ text: commentText, postId }),
      });
      const data = await response.json();

      if (response.ok) {
        setComments([data, ...comments]);
        setCommentText('');
      } else {
        showSnackbar(data.message || 'Failed to add comment.');
      }
    } catch (error) {
      showSnackbar('Network error. Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` },
      });

      if (response.ok) {
        setComments(comments.filter(c => c._id !== commentId));
        showSnackbar('Comment deleted.');
      } else {
        const data = await response.json();
        showSnackbar(data.message || 'Failed to delete comment.');
      }
    } catch (error) {
      showSnackbar('Network error. Could not connect to server.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <List.Item
            title={item.author?.username || 'Unknown User'}
            description={item.text}
            left={(props) => (
              item.author?.profilePicture ? (
                <Avatar.Image
                  {...props}
                  size={40}
                  source={{ uri: item.author.profilePicture }}
                />
              ) : (
                <Avatar.Text
                  {...props}
                  size={40}
                  label={(item.author?.username || 'U').charAt(0).toUpperCase()}
                />
              )
            )}
            right={(props) =>
              item.author?._id === userToken ? (
                <IconButton
                  {...props}
                  icon="delete"
                  iconColor="#e91e63"
                  onPress={() => handleDeleteComment(item._id)}
                />
              ) : null
            }
            titleStyle={{ color: '#fff', fontWeight: 'bold' }}
            descriptionStyle={{ color: '#ddd' }}
            descriptionNumberOfLines={10}
            style={styles.commentItem}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No comments yet. Be the first to comment!
            </Text>
          </View>
        )}
        contentContainerStyle={comments.length === 0 ? styles.emptyList : null}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment..."
          mode="outlined"
          style={styles.input}
          theme={{ colors: { text: '#fff', placeholder: '#888' } }}
          outlineColor="#333"
          activeOutlineColor="#6200ee"
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleAddComment}
              disabled={isSubmitting || !commentText.trim()}
              color={commentText.trim() ? '#6200ee' : '#555'}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  commentItem: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  inputContainer: {
    padding: 8,
    backgroundColor: '#1e1e1e',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    backgroundColor: '#1e1e1e',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    color: '#888',
  },
});

export default CommentsScreen;

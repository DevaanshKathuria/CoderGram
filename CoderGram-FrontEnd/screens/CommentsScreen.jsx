import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, List, Appbar, Avatar } from 'react-native-paper';
import client from '../api/client';

export default function CommentsScreen({ route, navigation }) {
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    try {
      const res = await client.get(`/comments/post/${post._id}`);
      const data = res.data.comments || res.data;
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Load comments err', err);
    }
  };

  useEffect(() => { loadComments(); }, []);

  const addComment = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await client.post('/comments', { postId: post._id, text });
      setText('');
      await loadComments();
    } catch (err) {
      console.log('Comment err', err);
      alert('Could not post comment');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Comments" />
        </Appbar.Header>

        <FlatList
          data={comments}
          keyExtractor={item => item._id || item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.author?.username || 'Unknown'}
              description={item.text}
              left={() => (
                <Avatar.Image
                  size={40}
                  source={{ uri: item.author?.profilePicture || 'https://via.placeholder.com/40' }}
                />
              )}
            />
          )}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.inputContainer}>
          <TextInput
            label="Add a comment..."
            value={text}
            onChangeText={setText}
            style={styles.input}
            mode="outlined"
          />
          <Button
            onPress={addComment}
            loading={loading}
            mode="contained"
            style={styles.sendButton}
          >
            Send
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  listContent: { paddingBottom: 10 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white'
  },
  input: { flex: 1, marginRight: 10, backgroundColor: 'white' },
  sendButton: { alignSelf: 'center' }
});

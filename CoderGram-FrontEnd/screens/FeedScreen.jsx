import React, { useState, useContext, useCallback, useRef } from 'react';
import { FlatList, RefreshControl, View, StyleSheet, StatusBar } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import PostCard from '../components/PostCard';

const API_URL = 'http://localhost:8000/api';

const FeedScreen = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        showSnackbar(data.message || 'Failed to fetch posts.');
      }
    } catch (error) {
      showSnackbar('Network error. Could not connect to server.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [userToken, showSnackbar]);

  const handleCommentPress = useCallback((post) => {
    navigation.navigate('Comments', { postId: post._id });
  }, [navigation]);

  const renderPost = useCallback(({ item }) => (
    <PostCard post={item} onCommentPress={handleCommentPress} />
  ), [handleCommentPress]);

  const keyExtractor = useCallback((item) => item._id, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      
      const loadData = async () => {
        setIsLoading(true);
        await fetchPosts();
      };

      if (isActive) {
        loadData();
      }

      return () => {
        isActive = false;
      };
    }, [fetchPosts])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#6200ee"
            colors={['#6200ee']}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text variant="titleLarge" style={styles.emptyText}>
              Welcome to CoderGram! 👋
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Start by creating your first post or search for users to follow
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={posts.length === 0 ? styles.emptyList : null}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={5}
        windowSize={10}
      />
    </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FeedScreen;

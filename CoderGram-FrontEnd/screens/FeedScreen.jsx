
import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client';
import PostCard from '../components/PostCard';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { useSnackbar } from '../context/SnackbarContext';

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchPosts = async () => {
    try {
      const res = await client.get('/posts');
      const data = res.data.posts || res.data;
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Fetch posts err', err.response?.data || err.message);
      showSnackbar('Could not load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.logo}>CoderGram</Text>
        <IconButton icon="email-outline" size={24} />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <PostCard post={item} onOpenComments={(post) => navigation.navigate('Comments', { post })} />
        )}
        contentContainerStyle={posts.length === 0 ? styles.emptyContainer : { paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="titleLarge" style={styles.emptyText}>No posts yet</Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Follow users or create your first post!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  logo: {
    fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'serif', 
    fontWeight: 'bold',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    color: '#999',
  }
});

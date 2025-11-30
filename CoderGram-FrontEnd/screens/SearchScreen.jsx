
import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, List, Avatar, ActivityIndicator, Text } from 'react-native-paper';
import client from '../api/client';
import { useSnackbar } from '../context/SnackbarContext';

export default function SearchScreen({ navigation }) {
  const { showSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);

  const doSearch = async (q) => {
    if (!q.trim()) {
      setUsers([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await client.get(`/users/search?q=${encodeURIComponent(q)}`);
      const data = res.data.users || res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Search err', err);
      showSnackbar('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeSearch = (q) => {
    setSearchQuery(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => doSearch(q), 400);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Searchbar placeholder="Search users" onChangeText={onChangeSearch} value={searchQuery} />
      {isLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
      {!isLoading && users.length === 0 && searchQuery.trim().length > 0 && (
        <View style={styles.emptyContainer}><Text style={styles.emptyText}>No users found</Text></View>
      )}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.username || item.name}
            description={item.bio || 'No bio'}
            left={() => <Avatar.Image size={40} source={{ uri: item.profilePicture || 'https://via.placeholder.com/40' }} />}
            onPress={() => navigation.navigate('Profile', { username: item.username })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  emptyText: { color: '#888' },
});

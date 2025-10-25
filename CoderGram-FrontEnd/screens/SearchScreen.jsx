import React, { useState, useContext, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, List, Avatar, ActivityIndicator, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const API_URL = 'http://localhost:8000/api';

const SearchScreen = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        showSnackbar(data.message || 'Search failed.');
      }
    } catch (error) {
      showSnackbar('Network error. Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchUsers(query);
    }, 500);
  };

  const handleUserPress = (username) => {
    navigation.navigate('Profile', { username });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search users..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
        iconColor="#fff"
        placeholderTextColor="#888"
        inputStyle={{ color: '#fff' }}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <List.Item
              title={item.username}
              description={item.bio || 'No bio'}
              left={(props) => (
                item.profilePicture ? (
                  <Avatar.Image
                    {...props}
                    size={48}
                    source={{ uri: item.profilePicture }}
                  />
                ) : (
                  <Avatar.Text
                    {...props}
                    size={48}
                    label={item.username.charAt(0).toUpperCase()}
                  />
                )
              )}
              onPress={() => handleUserPress(item.username)}
              titleStyle={{ color: '#fff' }}
              descriptionStyle={{ color: '#888' }}
              style={styles.listItem}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {searchQuery ? 'No users found' : 'Search for users to discover'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchbar: {
    margin: 16,
    backgroundColor: '#1e1e1e',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#888',
  },
});

export default SearchScreen;

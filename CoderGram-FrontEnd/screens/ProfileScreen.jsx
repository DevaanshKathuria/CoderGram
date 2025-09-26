import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const API_URL = 'http://localhost:5000/api';

const ProfileScreen = ({ route, navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const username = route.params?.username;

  const fetchProfile = async () => {
    try {
      const endpoint = username ? `${API_URL}/users/${username}` : `${API_URL}/users/me`;
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const data = await response.json();

      if (response.ok) {
        if (username) {
            setProfileData(data);
        } else {
            const postResponse = await fetch(`${API_URL}/users/${data.username}`, {
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
            const postData = await postResponse.json();
            setProfileData(postData);
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch profile.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setProfileData(null);
      fetchProfile();
    }, [username, userToken])
  );

  if (isLoading || !profileData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const { user, posts } = profileData;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
        <Image 
            style={styles.avatar} 
            source={user.profilePicture ? { uri: user.profilePicture } : require('../assets/default-avatar.png')} 
        />
        <Text style={styles.username}>{user.username}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        <View style={styles.statsContainer}>
            <View style={styles.stat}><Text style={styles.statCount}>{posts.length}</Text><Text style={styles.statLabel}>Posts</Text></View>
            <View style={styles.stat}><Text style={styles.statCount}>{user.followers.length}</Text><Text style={styles.statLabel}>Followers</Text></View>
            <View style={styles.stat}><Text style={styles.statCount}>{user.following.length}</Text><Text style={styles.statLabel}>Following</Text></View>
        </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={() => (<View style={styles.center}><Text style={styles.emptyText}>No Posts Yet</Text></View>)}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  headerContainer: { alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#333' },
  username: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  bio: { color: '#aaa', fontSize: 15, marginTop: 5, textAlign: 'center' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  stat: { alignItems: 'center' },
  statCount: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#aaa', fontSize: 14 },
  emptyText: { color: '#aaa', fontSize: 16, marginTop: 20 },
});

export default ProfileScreen;


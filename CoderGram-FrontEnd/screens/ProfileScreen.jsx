import React, { useState, useContext, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Avatar, Button, Title, Paragraph, ActivityIndicator, Text, Surface } from 'react-native-paper';

const API_URL = 'http://localhost:8000/api';

const ProfileScreen = ({ route, navigation }) => {
  const { user, userToken } = useContext(AuthContext); // 'user' can be null on first render
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // --- START OF FIX ---

  // We must wait for the user object to be loaded from context
  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  // If we are here, 'user' is guaranteed to be loaded
  const username = route.params?.username || user.username;
  const isMyProfile = user.username === username;

  // --- END OF FIX ---

  const fetchProfile = async () => {
    // This check ensures we don't try to fetch with an 'undefined' username
    // if something went wrong, though the guard clause above should prevent it.
    if (!username) {
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${username}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const data = await response.json();

      if (response.ok) {
        setProfileData(data);
        setIsFollowing(data.user.followers.includes(user._id));
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
    }, [username, userToken]) // 'username' is now a safe dependency
  );

  const handleFollowToggle = async () => {
    // ... (rest of the function is fine)
    const endpoint = isFollowing ? 'unfollow' : 'follow';
    try {
      const response = await fetch(`${API_URL}/users/${profileData.user._id}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${userToken}` },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setProfileData(prevData => ({
          ...prevData,
          user: {
            ...prevData.user,
            followers: isFollowing
              ? prevData.user.followers.filter(id => id !== user._id)
              : [...prevData.user.followers, user._id],
          },
        }));
      } else {
        Alert.alert('Error', 'Could not update follow status.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Something went wrong.');
    }
  };

  const renderProfileButton = () => {
    // ... (rest of the function is fine)
    if (isMyProfile) {
      return <Button mode="outlined" style={styles.profileButton} onPress={() => { /* Navigate to Edit Profile */ }}>Edit Profile</Button>;
    }
    return (
      <Button 
        mode={isFollowing ? "outlined" : "contained"} 
        style={styles.profileButton}
        onPress={handleFollowToggle}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    );
  };

  if (isLoading || !profileData) {
    return <View style={styles.center}><ActivityIndicator animating={true} size="large" /></View>;
  }

  const { user: profileUser, posts } = profileData;

  const renderHeader = () => (
    // ... (rest of the function is fine)
    <Surface style={styles.headerContainer}>
        {profileUser.profilePicture 
          ? <Avatar.Image size={100} source={{ uri: profileUser.profilePicture }} />
          : <Avatar.Icon size={100} icon="account" />
        }
        <Title style={styles.username}>{profileUser.username}</Title>
        {profileUser.bio && <Paragraph style={styles.bio}>{profileUser.bio}</Paragraph>}
        <View style={styles.statsContainer}>
            <View style={styles.stat}><Title>{posts.length}</Title><Text>Posts</Text></View>
            <View style={styles.stat}><Title>{profileData.user.followers.length}</Title><Text>Followers</Text></View>
            <View style={styles.stat}><Title>{profileData.user.following.length}</Title><Text>Following</Text></View>
        </View>
        {renderProfileButton()}
    </Surface>
  );

  return (
    // ... (rest of the component is fine)
    <FlatList
      style={styles.container}
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={renderHeader}
      onRefresh={fetchProfile}
      refreshing={isLoading}
      ListEmptyComponent={() => (<View style={styles.center}><Paragraph>No Posts Yet</Paragraph></View>)}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerContainer: { alignItems: 'center', padding: 20, elevation: 2 },
  username: { marginTop: 10, fontSize: 24 },
  bio: { marginTop: 5, textAlign: 'center' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  stat: { alignItems: 'center' },
  profileButton: {
    width: '80%',
    marginTop: 20,
  },
});

export default ProfileScreen;


import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ActivityIndicator, Text, Avatar, Button, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const ProfileScreen = ({ route, navigation }) => {
  // All hooks at the top level
  const { userToken } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  
  // State management
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  // Get username from route params or use current user's profile
  const { username } = route.params || {};
  const currentUserId = userToken?.split('.')[0];

  // Memoized fetch profile function
  const fetchProfile = useCallback(async () => {
    if (!userToken) return;
    
    try {
      const endpoint = username 
        ? `${API_URL}/users/profile/${username}`
        : `${API_URL}/users/me`;
      
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        // Check if current user is following this profile
        if (data.user?.followers?.includes(currentUserId)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      } else {
        const error = await response.json();
        showSnackbar(error.message || 'Failed to load profile');
      }
    } catch (error) {
      showSnackbar('Network error');
    } finally {
      setIsLoading(false);
    }
  }, [userToken, username, currentUserId, showSnackbar]);

  // Handle follow/unfollow
  const handleFollowToggle = useCallback(async () => {
    if (!profileData?.user?._id || !userToken) return;
    
    setFollowLoading(true);
    const wasFollowing = isFollowing;
    
    try {
      // Optimistic update
      setIsFollowing(!wasFollowing);
      
      const endpoint = wasFollowing
        ? `${API_URL}/users/unfollow/${profileData.user._id}`
        : `${API_URL}/users/follow/${profileData.user._id}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${userToken}` },
      });

      if (!response.ok) {
        // Revert on error
        setIsFollowing(wasFollowing);
        const error = await response.json();
        throw new Error(error.message || 'Failed to update follow status');
      }
      
      // Update local state
      const updatedData = await response.json();
      setProfileData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          followers: updatedData.followers || []
        }
      }));
      
    } catch (error) {
      showSnackbar(error.message || 'An error occurred');
    } finally {
      setFollowLoading(false);
    }
  }, [profileData, isFollowing, userToken, showSnackbar]);

  // Handle comment press
  const handleCommentPress = useCallback((post) => {
    navigation.navigate('Comments', { postId: post._id });
  }, [navigation]);

  // Load profile on focus or when username changes
  useEffect(() => {
    let isActive = true;
    
    const loadProfile = async () => {
      if (isActive) {
        setIsLoading(true);
        await fetchProfile();
      }
    };
    
    loadProfile();
    
    return () => {
      isActive = false;
    };
  }, [fetchProfile]);

  // Loading state
  if (isLoading || !profileData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const { user, posts = [] } = profileData;
  const isOwnProfile = !username || user._id === currentUserId;

  // Render header with user info
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topSection}>
        <View style={styles.avatarWrapper}>
          {user.profilePicture ? (
            <Avatar.Image
              size={90}
              source={{ uri: user.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={90}
              label={user.username?.charAt(0)?.toUpperCase() || 'U'}
              style={styles.avatar}
            />
          )}
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statCount}>
              {posts.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Posts
            </Text>
          </View>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statCount}>
              {user.followers?.length || 0}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Followers
            </Text>
          </View>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statCount}>
              {user.following?.length || 0}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Following
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bioSection}>
        <Text variant="titleMedium" style={styles.username}>
          {user.username}
        </Text>
        {user.bio && (
          <Text variant="bodyMedium" style={styles.bio}>
            {user.bio}
          </Text>
        )}
      </View>
      
      {!isOwnProfile && (
        <Button
          mode={isFollowing ? "outlined" : "contained"}
          onPress={handleFollowToggle}
          loading={followLoading}
          disabled={followLoading}
          style={styles.followButton}
          buttonColor={isFollowing ? 'transparent' : '#6200ee'}
          textColor="#fff"
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
      
      <Divider style={styles.divider} />
    </View>
  );

  // Render post item
  const renderPost = useCallback(({ item }) => (
    <PostCard post={item} onCommentPress={handleCommentPress} />
  ), [handleCommentPress]);

  // Key extractor for FlatList
  const keyExtractor = useCallback((item) => item._id, []);

  return (
    <FlatList
      style={styles.container}
      data={posts}
      renderItem={renderPost}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text variant="bodyMedium" style={styles.emptyText}>
            No posts yet
          </Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      initialNumToRender={5}
      windowSize={10}
    />
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
  headerContainer: {
    padding: 16,
    paddingTop: 20,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    marginRight: 20,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#aaa',
    marginTop: 2,
    fontSize: 13,
  },
  bioSection: {
    marginBottom: 12,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bio: {
    color: '#fff',
    marginTop: 4,
    lineHeight: 20,
  },
  followButton: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#6200ee',
  },
  divider: {
    width: '100%',
    backgroundColor: '#333',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#aaa',
  },
});

export default ProfileScreen;

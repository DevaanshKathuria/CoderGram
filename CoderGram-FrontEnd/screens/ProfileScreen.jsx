
import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, ActivityIndicator, Avatar, IconButton } from 'react-native-paper';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { API_BASE } from '../config';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/150';
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${API_BASE.replace('/api', '')}/${cleanPath}`;
};

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

export default function ProfileScreen({ navigation, route }) {
  const { user: currentUser, signOut, setUser: setAuthUser } = useContext(AuthContext) || {};
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isMyProfile = !route?.params?.username || route?.params?.username === currentUser?.username;

  const loadProfile = async () => {
    try {
      setLoading(true);
      if (isMyProfile) {
        
        const res = await client.get('/users/me');
        const userData = res.data.user || res.data;
        setProfile(userData);

        const res2 = await client.get('/posts?mine=true');
        const data = res2.data.posts || res2.data;
        setPosts(Array.isArray(data) ? data : []);
      } else {
        
        const username = route.params.username;
        const res = await client.get(`/users/${username}`);
        const userData = res.data.user || res.data; 
        setProfile(userData);
        setPosts(res.data.posts || []);

        
        if (currentUser && currentUser.following) {
          setFollowing(currentUser.following.includes(userData._id));
        }
      }
    } catch (err) {
      console.log('Profile load err', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [route?.params?.username, isMyProfile]);

  
  useEffect(() => {
    if (isMyProfile) {
      const unsubscribe = navigation.addListener('focus', loadProfile);
      return unsubscribe;
    }
  }, [navigation, isMyProfile]);

  const handleFollow = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      if (following) {
        await client.put(`/users/unfollow/${profile._id}`);
        setFollowing(false);
        
        if (currentUser && setAuthUser) {
          const newFollowing = currentUser.following.filter(id => id !== profile._id);
          setAuthUser({ ...currentUser, following: newFollowing });
        }
      } else {
        await client.put(`/users/follow/${profile._id}`);
        setFollowing(true);
        
        if (currentUser && setAuthUser) {
          const newFollowing = [...(currentUser.following || []), profile._id];
          setAuthUser({ ...currentUser, following: newFollowing });
        }
      }
      
      loadProfile();
    } catch (err) {
      console.log('Follow error', err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <Avatar.Image size={80} source={{ uri: getImageUrl(profile?.profilePicture) }} />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.followers?.length || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.following?.length || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.name}>{profile?.username}</Text>
        <Text style={styles.bio}>{profile?.bio || 'No bio yet.'}</Text>
      </View>

      <View style={styles.actions}>
        {isMyProfile ? (
          <>
            <Button
              mode="contained"
              buttonColor="#efefef"
              textColor="black"
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile', { user: profile })}
            >
              Edit Profile
            </Button>
            <Button
              mode="contained"
              buttonColor="#efefef"
              textColor="black"
              style={styles.logoutButton}
              onPress={signOut}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            buttonColor={following ? "#efefef" : "#0095f6"}
            textColor={following ? "black" : "white"}
            style={styles.editButton}
            onPress={handleFollow}
            loading={followLoading}
          >
            {following ? 'Following' : 'Follow'}
          </Button>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Comments', { post: item })}>
      {item.image ? (
        <Image source={{ uri: getImageUrl(item.image) }} style={styles.gridImage} />
      ) : (
        <View style={[styles.gridImage, styles.codePlaceholder]}>
          <Avatar.Icon size={40} icon="code-tags" style={{ backgroundColor: 'transparent' }} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {!isMyProfile && (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text variant="titleMedium">{profile?.username}</Text>
        </View>
      )}
      <FlatList
        data={posts}
        keyExtractor={item => item._id || item.id}
        renderItem={renderItem}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { padding: 15 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  statsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginLeft: 20 },
  statItem: { alignItems: 'center' },
  statNumber: { fontWeight: 'bold', fontSize: 18 },
  statLabel: { fontSize: 12 },
  bioContainer: { marginBottom: 15 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  bio: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10 },
  editButton: { flex: 1, borderRadius: 5 },
  logoutButton: { borderRadius: 5 },
  gridImage: { width: ITEM_SIZE, height: ITEM_SIZE, borderWidth: 1, borderColor: 'white' },
  codePlaceholder: { backgroundColor: '#1e1e1e', justifyContent: 'center', alignItems: 'center' }
});

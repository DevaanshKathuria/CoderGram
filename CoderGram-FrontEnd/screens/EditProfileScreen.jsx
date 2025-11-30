import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import client from '../api/client';

export default function EditProfileScreen({ route, navigation }) {
    const { user } = route.params || {};
    const [bio, setBio] = useState(user?.bio || '');
    const [image, setImage] = useState(user?.profilePicture || null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) { alert('Permission required'); return; }
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const updateProfile = async () => {
        setLoading(true);
        try {
            const form = new FormData();
            if (image && image !== user?.profilePicture) {
                const filename = image.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const ext = match ? match[1] : 'jpg';
                form.append('profilePicture', {
                    uri: Platform.OS === 'android' ? image : image.replace('file://', ''),
                    name: filename,
                    type: `image/${ext}`,
                });
            }
            form.append('bio', bio);

            const res = await client.put('/users/update', form, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigation.goBack();
        } catch (err) {
            console.log('Update err', err.response?.data || err.message);
            alert('Update failed');
        } finally { setLoading(false); }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: image || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                    <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                label="Bio"
                value={bio}
                onChangeText={setBio}
                multiline
                style={styles.input}
            />

            <Button mode="contained" onPress={updateProfile} loading={loading} style={styles.button}>
                Save
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    imageContainer: { alignItems: 'center', marginBottom: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    changePhotoText: { color: '#3498db', fontWeight: 'bold' },
    input: { marginBottom: 20, backgroundColor: 'white' },
    button: { marginTop: 10 }
});

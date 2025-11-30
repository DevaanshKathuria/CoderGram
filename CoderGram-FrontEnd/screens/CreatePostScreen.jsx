
import React, { useState } from 'react';
import { View, StyleSheet, Platform, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Appbar, Text, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import client from '../api/client';
import { useSnackbar } from '../context/SnackbarContext';

export default function CreatePostScreen({ navigation }) {
  const [postType, setPostType] = useState('image'); 
  const [image, setImage] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showSnackbar('Camera roll permission is required');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadPost = async () => {
    if (postType === 'image' && !image && !caption) {
      showSnackbar('Please add an image or caption');
      return;
    }
    if (postType === 'code' && !code) {
      showSnackbar('Please add some code');
      return;
    }

    setLoading(true);
    try {
      
      
      
      
      
      
      

      const form = new FormData();
      if (postType === 'image' && image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const ext = match ? match[1] : 'jpg';
        form.append('image', {
          uri: Platform.OS === 'android' ? image : image.replace('file://', ''),
          name: filename,
          type: `image/${ext}`,
        });
      }

      if (postType === 'code') {
        form.append('code', code);
        form.append('language', language);
      }

      form.append('caption', caption);

      await client.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      showSnackbar('Post created successfully!');
      setImage(null);
      setCaption('');
      setCode('');
      navigation.navigate('Feed');
    } catch (err) {
      console.log('Upload err', err.response?.data || err.message);
      showSnackbar('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Create Post" />
        <Appbar.Action
          icon="check"
          onPress={uploadPost}
          disabled={loading || (postType === 'image' && !image && !caption) || (postType === 'code' && !code)}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.typeSelector}>
          <Button
            mode={postType === 'image' ? 'contained' : 'outlined'}
            onPress={() => setPostType('image')}
            style={styles.typeButton}
          >
            Image
          </Button>
          <Button
            mode={postType === 'code' ? 'contained' : 'outlined'}
            onPress={() => setPostType('code')}
            style={styles.typeButton}
          >
            Code
          </Button>
        </View>

        {postType === 'image' ? (
          <>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.preview} />
                <IconButton
                  icon="close-circle"
                  size={30}
                  style={styles.removeButton}
                  onPress={() => setImage(null)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                <IconButton icon="camera" size={60} />
                <Text variant="titleMedium">Tap to select an image</Text>
              </TouchableOpacity>
            )}

            {!image && (
              <Button
                mode="outlined"
                onPress={pickImage}
                icon="image"
                style={styles.selectButton}
              >
                Select Image
              </Button>
            )}
          </>
        ) : (
          <>
            <TextInput
              label="Language (e.g. javascript, python)"
              value={language}
              onChangeText={setLanguage}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Paste your code here..."
              value={code}
              onChangeText={setCode}
              multiline
              numberOfLines={10}
              style={[styles.input, styles.codeInput]}
              mode="outlined"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </>
        )}

        <TextInput
          label="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={4}
          style={styles.input}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={uploadPost}
          loading={loading}
          disabled={loading || (postType === 'image' && !image && !caption) || (postType === 'code' && !code)}
          style={styles.postButton}
        >
          Share Post
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 16 },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  typeButton: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  codeInput: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  selectButton: {
    marginBottom: 12,
  },
  postButton: {
    paddingVertical: 8,
  }
});

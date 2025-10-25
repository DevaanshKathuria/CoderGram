import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Menu, ActivityIndicator, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const API_URL = 'http://localhost:8000/api';

const LANGUAGES = [
  'javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'ruby', 'go',
  'rust', 'swift', 'kotlin', 'typescript', 'php', 'html', 'css', 'sql',
  'bash', 'powershell', 'r', 'matlab', 'scala', 'dart', 'other'
];

const CreatePostScreen = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const [caption, setCaption] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!code.trim()) {
      showSnackbar('Code cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ caption, code, language }),
      });
      const data = await response.json();

      if (response.ok) {
        showSnackbar('Post created successfully!');
        navigation.goBack();
      } else {
        showSnackbar(data.message || 'Failed to create post.');
      }
    } catch (error) {
      showSnackbar('Network error. Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <TextInput
            label="Caption (optional)"
            value={caption}
            onChangeText={setCaption}
            mode="outlined"
            multiline
            numberOfLines={2}
            style={styles.input}
            theme={{ colors: { text: '#fff', placeholder: '#888' } }}
            outlineColor="#333"
            activeOutlineColor="#6200ee"
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.languageButton}
                textColor="#fff"
              >
                Language: {language}
              </Button>
            }
            contentStyle={styles.menu}
          >
            {LANGUAGES.map((lang) => (
              <Menu.Item
                key={lang}
                onPress={() => {
                  setLanguage(lang);
                  setMenuVisible(false);
                }}
                title={lang}
                titleStyle={{ color: '#fff' }}
              />
            ))}
          </Menu>

          <TextInput
            label="Code *"
            value={code}
            onChangeText={setCode}
            mode="outlined"
            multiline
            numberOfLines={15}
            style={[styles.input, styles.codeInput]}
            theme={{ colors: { text: '#fff', placeholder: '#888' } }}
            outlineColor="#333"
            activeOutlineColor="#6200ee"
            textAlignVertical="top"
          />

          <Button
            mode="contained"
            onPress={handleCreatePost}
            disabled={isSubmitting}
            style={styles.submitButton}
            buttonColor="#6200ee"
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : 'Create Post'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
  },
  codeInput: {
    fontFamily: 'monospace',
    minHeight: 200,
  },
  languageButton: {
    marginBottom: 16,
    borderColor: '#333',
  },
  menu: {
    backgroundColor: '#1e1e1e',
    maxHeight: 300,
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 6,
  },
});

export default CreatePostScreen;

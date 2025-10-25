import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const API_URL = 'http://localhost:8000/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  const handleLogin = async () => {
    if (!email || !password) {
      showSnackbar('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token);
      } else {
        showSnackbar(data.message || 'Login failed.');
      }
    } catch (error) {
      showSnackbar('Network error. Unable to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text variant="displayLarge" style={styles.title}>CoderGram</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>Share Your Code Journey</Text>
        </View>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          theme={{ colors: { text: '#fff', placeholder: '#888' } }}
          outlineColor="#333"
          activeOutlineColor="#6200ee"
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          theme={{ colors: { text: '#fff', placeholder: '#888' } }}
          outlineColor="#333"
          activeOutlineColor="#6200ee"
        />
        
        <Button
          mode="contained"
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.button}
          buttonColor="#6200ee"
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : 'Log In'}
        </Button>
        
        <Button
          mode="text"
          onPress={() => navigation.navigate('Signup')}
          textColor="#6200ee"
          style={styles.switchButton}
        >
          Don't have an account? Sign Up
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  switchButton: {
    marginTop: 20,
  },
});

export default LoginScreen;

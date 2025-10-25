import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const API_URL = 'http://localhost:8000/api';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  const handleSignup = async () => {
     if (!username || !email || !password) {
      showSnackbar('Please fill in all fields.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token);
      } else {
        showSnackbar(data.message || 'Signup failed.');
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
        <Text variant="headlineLarge" style={styles.title}>Create Account</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Join the CoderGram community</Text>
        
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          theme={{ colors: { text: '#fff', placeholder: '#888' } }}
          outlineColor="#333"
          activeOutlineColor="#6200ee"
        />
        
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
          onPress={handleSignup}
          disabled={isLoading}
          style={styles.button}
          buttonColor="#6200ee"
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : 'Sign Up'}
        </Button>
        
        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          textColor="#6200ee"
          style={styles.switchButton}
        >
          Already have an account? Log In
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: '#888', textAlign: 'center', marginBottom: 32 },
    input: { marginBottom: 16, backgroundColor: '#1e1e1e' },
    button: { marginTop: 8, paddingVertical: 6 },
    switchButton: { marginTop: 16 },
});

export default SignupScreen;

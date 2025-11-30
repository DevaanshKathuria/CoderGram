
import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text } from 'react-native-paper';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await client.post('/auth/register', { username, email, password });
      const token = res.data.token || res.data.accessToken || res.data;
      if (!token) throw new Error('No token in response');
      await setToken(token);
    } catch (err) {
      console.log('Signup err', err.response?.data || err.message);
      showSnackbar('Signup failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          textColor="white"
          theme={{ colors: { onSurfaceVariant: '#ccc' } }}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          textColor="white"
          theme={{ colors: { onSurfaceVariant: '#ccc' } }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          textColor="white"
          theme={{ colors: { onSurfaceVariant: '#ccc' } }}
        />
        <Button
          mode="contained"
          onPress={handleSignup}
          loading={loading}
          style={styles.button}
        >
          Create Account
        </Button>
        <Button
          onPress={() => navigation.goBack()}
          style={styles.switchButton}
        >
          Already have an account? Login
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
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

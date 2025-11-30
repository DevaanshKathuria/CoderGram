
import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await client.post('/auth/login', { email, password });
      const token = res.data.token || res.data.accessToken || res.data;
      if (!token) throw new Error('No token returned');
      await setToken(token);
    } catch (err) {
      console.log('Login error', err.response?.data || err.message);
      showSnackbar('Login failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text variant="headlineMedium" style={{color: 'white', textAlign: 'center', marginBottom: 20}}>Login</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
        <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
        <Button mode="contained" onPress={handleLogin} style={styles.button} loading={isLoading}>Login</Button>
        <Button onPress={() => navigation.navigate('Signup')} style={styles.switchButton}>Create account</Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
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

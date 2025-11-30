import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('token');
        if (t) {
          setTokenState(t);
          try {
            const res = await client.get('/auth/me');
            setUser(res.data.user || res.data);
          } catch (e) {
          }
        }
      } catch (err) {
        console.log('Auth load error', err);
      } finally {
        setLoadingAuth(false);
      }
    })();
  }, []);

  const signIn = async (tokenValue) => {
    try {
      await AsyncStorage.setItem('token', tokenValue);
      setTokenState(tokenValue);
      try {
        const res = await client.get('/auth/me');
        setUser(res.data.user || res.data);
      } catch (e) {
      }
    } catch (e) {
      console.log('signIn error', e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (e) {}
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken: signIn, signOut, user, setUser, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

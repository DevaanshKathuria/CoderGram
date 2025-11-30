import 'react-native-gesture-handler';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './navigation/appNavigator';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <SnackbarProvider>
            <AppNavigator />
          </SnackbarProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

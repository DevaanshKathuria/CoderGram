import React from 'react';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import AppNav from './screens/AppNavigator';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6200ee',
    background: '#000',
    surface: '#1e1e1e',
    surfaceVariant: '#2d2d2d',
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SnackbarProvider>
          <AppNav />
        </SnackbarProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;

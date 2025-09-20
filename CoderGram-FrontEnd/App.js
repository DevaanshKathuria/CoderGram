import React from 'react';
import { AuthProvider } from './AuthContext';
import AppNav from './screens/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
};

export default App;

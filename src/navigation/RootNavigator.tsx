import React from 'react';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuthStore } from '../store/authStore';

export default function RootNavigator() {
  const isAuthenticated = !!useAuthStore((s) => s.token);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  return <AppNavigator />;
}

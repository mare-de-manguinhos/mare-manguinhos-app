import React from 'react';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

/**
 * TODO: Substituir `isAuthenticated` pela leitura do authStore quando implementado:
 *   import { useAuthStore } from '../store/authStore';
 *   const isAuthenticated = !!useAuthStore((s) => s.token);
 */
const isAuthenticated = false;

export default function RootNavigator() {
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  return <AppNavigator />;
}

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './contexts/SupabaseAuthContext';
import AppContent from './App_Step3';

export default function App() {
  console.log('🎯 UGood 最終版本 - 包含 Supabase 認證');
  
  return (
    <AuthProvider>
      <AppContent />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

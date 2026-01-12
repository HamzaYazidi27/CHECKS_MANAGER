import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { ChecksProvider } from '@/context/checks-context';
import { notificationService } from '@/utils/notifications';
import LoginScreen from './login';

// Configure AsyncStorage globally
(global as any).AsyncStorage = AsyncStorage;

function RootLayoutContent() {
  const { isLoggedIn, loading } = useAuth();

  // Initialiser les notifications au démarrage
  useEffect(() => {
    const initNotifications = async () => {
      try {
        const hasPermission = await notificationService.requestPermissions();
        if (hasPermission) {
          console.log('✅ Notifications activées');
        }
      } catch (error) {
        console.error('Erreur initialisation notifications:', error);
      }
    };

    initNotifications();
  }, []);

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-check" options={{ presentation: 'modal', title: 'Ajouter un chèque' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ChecksProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootLayoutContent />
          <StatusBar style="auto" />
        </ThemeProvider>
      </ChecksProvider>
    </AuthProvider>
  );
}

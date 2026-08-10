import { Sora_500Medium, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold, useFonts } from '@expo-google-fonts/sora';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ Sora_500Medium, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold });
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);
  if (!loaded) return null;
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper }, animation: 'slide_from_right' }}><Stack.Screen name="(tabs)" /><Stack.Screen name="redemption/[offerId]" options={{ presentation: 'transparentModal', animation: 'fade' }} /><Stack.Screen name="reward/[id]" options={{ presentation: 'transparentModal', animation: 'fade' }} /></Stack></SafeAreaProvider></GestureHandlerRootView>;
}


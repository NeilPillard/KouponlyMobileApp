import { Tabs } from 'expo-router';
import { Home, Map, Search, UserRound } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

function TabIcon({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      {children}
      {focused ? <View style={styles.activeDot} /> : null}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.ink,
    tabBarInactiveTintColor: '#77777F',
    tabBarLabelStyle: styles.label,
    tabBarStyle: {
      position: 'absolute',
      left: 8,
      right: 8,
      bottom: 7,
      height: 68 + Math.max(insets.bottom, 0),
      paddingTop: 4,
      paddingBottom: 4 + Math.max(insets.bottom, 0),
      paddingHorizontal: 4,
      borderTopWidth: 1,
      borderWidth: 1,
      borderColor: '#ECECEC',
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.98)',
      elevation: 10,
      shadowColor: colors.ink,
      shadowOpacity: 0.14,
      shadowOffset: { width: 0, height: 7 },
      shadowRadius: 20,
    },
    tabBarItemStyle: styles.item,
    tabBarActiveBackgroundColor: colors.white,
    tabBarHideOnKeyboard: true,
  }}>
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarButtonTestID:'tab-home', tabBarIcon: ({ color, focused }) => <TabIcon focused={focused}><Home size={21} color={color} strokeWidth={focused ? 2.5 : 2} /></TabIcon> }} />
    <Tabs.Screen name="search" options={{ title: 'Search', tabBarButtonTestID:'tab-search', tabBarIcon: ({ color, focused }) => <TabIcon focused={focused}><Search size={21} color={color} strokeWidth={focused ? 2.5 : 2} /></TabIcon> }} />
    <Tabs.Screen name="map" options={{ title: 'Map', tabBarButtonTestID:'tab-map', tabBarIcon: ({ color, focused }) => <TabIcon focused={focused}><Map size={21} color={color} strokeWidth={focused ? 2.5 : 2} /></TabIcon> }} />
    <Tabs.Screen name="me" options={{ title: 'Me', tabBarButtonTestID:'tab-me', tabBarIcon: ({ color, focused }) => <TabIcon focused={focused}><UserRound size={21} color={color} strokeWidth={focused ? 2.5 : 2} /></TabIcon> }} />
  </Tabs>;
}

const styles = StyleSheet.create({
  item: {
    minHeight: 56,
    marginHorizontal: 2,
    marginVertical: 2,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  label: {
    marginTop: 1,
    fontFamily: 'Sora_700Bold',
    fontSize: 9,
    lineHeight: 13,
  },
  iconWrap: {
    width: 34,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconWrapActive: { borderColor: '#0A0A0A' },
  activeDot: {
    position: 'absolute',
    top: 0,
    right: 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lime,
    borderWidth: 1,
    borderColor: colors.ink,
  },
});

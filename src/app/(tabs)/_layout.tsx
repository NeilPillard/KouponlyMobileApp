import { Tabs } from 'expo-router';
import { Home, Map, Search, UserRound } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

function TabIcon({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.iconWrap}>
      {children}
      {focused ? <View style={styles.activeDot} /> : null}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.white,
    tabBarInactiveTintColor: '#77777F',
    tabBarLabelStyle: styles.label,
    tabBarStyle: {
      position: 'absolute',
      left: 10,
      right: 10,
      bottom: 8,
      height: 70 + Math.max(insets.bottom, 0),
      paddingTop: 5,
      paddingBottom: 5 + Math.max(insets.bottom, 0),
      paddingHorizontal: 5,
      borderTopWidth: 0,
      borderRadius: 25,
      backgroundColor: colors.white,
      elevation: 14,
      shadowColor: colors.ink,
      shadowOpacity: 0.14,
      shadowOffset: { width: 0, height: 7 },
      shadowRadius: 20,
    },
    tabBarItemStyle: styles.item,
    tabBarActiveBackgroundColor: colors.ink,
    tabBarHideOnKeyboard: true,
  }}>
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, focused }) => <TabIcon focused={focused}><Home size={21} color={color} strokeWidth={focused ? 2.5 : 2} /></TabIcon> }} />
    <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color, focused }) => <TabIcon focused={focused}><Search size={21} color={color} strokeWidth={focused ? 2.5 : 2} /></TabIcon> }} />
    <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: ({ color, focused }) => <TabIcon focused={focused}><Map size={21} color={color} strokeWidth={focused ? 2.5 : 2} /></TabIcon> }} />
    <Tabs.Screen name="me" options={{ title: 'Me', tabBarIcon: ({ color, focused }) => <TabIcon focused={focused}><UserRound size={21} color={color} strokeWidth={focused ? 2.5 : 2} /></TabIcon> }} />
  </Tabs>;
}

const styles = StyleSheet.create({
  item: {
    minHeight: 60,
    marginHorizontal: 3,
    marginVertical: 1,
    borderRadius: 19,
  },
  label: {
    marginTop: 1,
    fontFamily: 'Sora_700Bold',
    fontSize: 10,
    lineHeight: 13,
  },
  iconWrap: {
    width: 28,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: -1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lime,
  },
});

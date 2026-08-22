import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#6B1F2A',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: { backgroundColor: '#fff' },
    }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: () => <Text>🏠</Text> }} />
      <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: () => <Text>🗺️</Text> }} />
      <Tabs.Screen name="family" options={{ title: 'Family', tabBarIcon: () => <Text>👨‍👩‍👧</Text> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: () => <Text>⚙️</Text> }} />
    </Tabs>
  );
}
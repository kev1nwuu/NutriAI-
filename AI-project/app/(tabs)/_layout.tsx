import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Camera, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { NutritionProvider } from '../../hooks/NutritionLogContext';
import { ThemeProvider, useThemeMode } from '../../hooks/ThemeContext';

function TabsInner() {
  const { isDark } = useThemeMode();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#020617' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 90 : 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Scan',
          tabBarIcon: ({ size, color }) => (
            <Camera size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <NutritionProvider>
        <TabsInner />
      </NutritionProvider>
    </ThemeProvider>
  );
}

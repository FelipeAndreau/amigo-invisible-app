import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/shared/hooks/useAuth';
import { ToastProvider } from './src/shared/context/ToastContext';
import { useFonts, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

import LoginScreen from './src/features/auth/LoginScreen';
import DashboardScreen from './src/features/event/DashboardScreen';
import CreateEventScreen from './src/features/event/CreateEventScreen';
import EventDetailScreen from './src/features/event/EventDetailScreen';
import JoinEventScreen from './src/features/event/JoinEventScreen';
import ChatScreen from './src/features/chat/ChatScreen';
import FriendsScreen from './src/features/friends/FriendsScreen';
import PreferencesScreen from './src/features/event/PreferencesScreen';
import GiftProgressScreen from './src/features/event/GiftProgressScreen';
import GalleryScreen from './src/features/event/GalleryScreen';
import HistoryScreen from './src/features/event/HistoryScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { token, isLoading: authLoading } = useAuth();
  const [fontsLoaded] = useFonts({
    'Fredoka-Bold': Fredoka_700Bold,
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
  });

  if (authLoading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E11D48" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#FFFFFF' } }}>
      {token === null ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="JoinEvent" component={JoinEventScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Preferences" component={PreferencesScreen} />
          <Stack.Screen name="GiftProgress" component={GiftProgressScreen} />
          <Stack.Screen name="Gallery" component={GalleryScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
  }
});
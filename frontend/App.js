import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ShowDetailScreen from './screens/ShowDetailScreen';
import BookingScreen from './screens/BookingScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkToken = async () => {
      try {
        let token;
        if (Platform.OS === 'web') {
          token = localStorage.getItem('userToken');
        } else {
          token = await SecureStore.getItemAsync('userToken');
        }
        setUserToken(token);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {userToken == null ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="ShowDetail" component={ShowDetailScreen} options={{ title: 'Show Details' }} />
              <Stack.Screen name="Booking" component={BookingScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

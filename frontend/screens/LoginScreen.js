import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (Platform.OS === 'web') {
        localStorage.setItem('userToken', response.data.token);
        // Direct reload to refresh the App state and show the Home stack
        window.location.href = '/';
      } else {
        await SecureStore.setItemAsync('userToken', response.data.token);
        Alert.alert('Success', 'Logged in successfully. Please restart the app.');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Theater Check</Title>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>Login</Button>
      <Button onPress={() => navigation.navigate('Register')}>Don't have an account? Register</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 32,
    fontWeight: '900',
    color: '#6200ee',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  input: { marginBottom: 15, backgroundColor: '#fff' },
  button: { marginTop: 15, paddingVertical: 5 },
  linkButton: { marginTop: 10 }
});

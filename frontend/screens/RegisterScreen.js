import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      window.alert('⚠️ Please fill in all fields.');
      return;
    }

    try {
      console.log("Sending registration request...");
      const response = await api.post('/auth/register', { name, email, password });

      console.log("Registration response:", response.data);

      // If we reach here, it means the status code was 2xx
      if (Platform.OS === 'web') {
        window.alert('✅ Account created successfully! Please login.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Success', 'Account created! Please login.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error("Registration catch error:", error);

      let errorMsg = 'Registration failed. Please try again.';
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        errorMsg = error.response.data?.message || errorMsg;
      } else if (error.request) {
        // The request was made but no response was received
        errorMsg = 'No response from server. Check if backend is running.';
      }

      if (Platform.OS === 'web') {
        window.alert('❌ Error: ' + errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create Account</Title>
      <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>Register</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '900',
    color: '#6200ee',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },
  input: { marginBottom: 15, backgroundColor: '#fff' },
  button: { marginTop: 15, paddingVertical: 5 }
});

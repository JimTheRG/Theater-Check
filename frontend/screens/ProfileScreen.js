import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, Platform } from 'react-native';
import { Title, Card, Paragraph, Button, List } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function ProfileScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reservations/user');
      setBookings(response.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = (id) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No' },
      { text: 'Yes', onPress: async () => {
          try {
            await api.delete(`/reservations/${id}`);
            fetchBookings();
          } catch (e) {
            Alert.alert('Error', 'Could not cancel booking.');
          }
      }}
    ]);
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('userToken');
      window.location.reload();
    } else {
      await SecureStore.deleteItemAsync('userToken');
      Alert.alert('Logged Out', 'Please restart the app.');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.showTitle}</Title>
        <Paragraph>{item.theatreName}</Paragraph>
        <Paragraph>{new Date(item.show_date).toLocaleDateString()} @ {item.show_time}</Paragraph>
        <Paragraph>Seats: {JSON.parse(item.seats).join(', ')}</Paragraph>
        <Paragraph style={item.status === 'active' ? styles.active : styles.cancelled}>
            Status: {item.status.toUpperCase()}
        </Paragraph>
      </Card.Content>
      {item.status === 'active' && (
        <Card.Actions>
          <Button onPress={() => handleCancel(item.reservation_id)} color="red">Cancel</Button>
        </Card.Actions>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>My Bookings</Title>
        <Button onPress={handleLogout}>Logout</Button>
      </View>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.reservation_id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchBookings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  card: { marginBottom: 10 },
  active: { color: 'green', fontWeight: 'bold' },
  cancelled: { color: 'red' }
});

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Title, Button, Paragraph, Chip } from 'react-native-paper';
import api from '../services/api';

export default function BookingScreen({ route, navigation }) {
  const { show, showtime } = route.params;
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        // Updated to use the explicit /seats endpoint per requirements
        const response = await api.get(`/shows/seats`, { params: { showTimeId: showtime.show_time_id } });
        setSeats(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSeats();
  }, [showtime.show_time_id]);

  const toggleSeat = (id) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      if (Platform.OS === 'web') window.alert('⚠️ Please select at least one seat.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/reservations', {
        showId: show.show_id,
        showTimeId: showtime.show_time_id,
        seats: selectedSeats
      });

      if (Platform.OS === 'web') {
        window.alert('✅ Booking confirmed! Redirecting to your bookings...');
      }
      navigation.navigate('Profile');
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      if (Platform.OS === 'web') window.alert('❌ Booking failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.headerTitle}>Select Seats for {show.title}</Title>
      <Paragraph style={styles.headerSubtitle}>{new Date(showtime.show_date).toDateString()} at {showtime.show_time}</Paragraph>

      <View style={styles.legend}>
         <Chip style={styles.chipAvailable} textStyle={styles.legendText}>Available</Chip>
         <Chip style={styles.chipSelected} textStyle={styles.legendTextSelected}>Selected</Chip>
         <Chip style={styles.chipOccupied} textStyle={styles.legendText}>Occupied</Chip>
      </View>

      <FlatList
        data={seats}
        numColumns={4} // Adjusted for web view
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            mode={selectedSeats.includes(item.id) ? "contained" : "outlined"}
            disabled={!item.available}
            onPress={() => toggleSeat(item.id)}
            style={styles.seat}
            labelStyle={styles.seatLabel}
          >
            {item.id}
          </Button>
        )}
        contentContainerStyle={styles.grid}
      />

      <View style={styles.footer}>
        <Paragraph style={styles.totalText}>Total Price: {selectedSeats.length * showtime.price}€</Paragraph>
        <Button
            mode="contained"
            onPress={handleBooking}
            loading={isSubmitting}
            disabled={isSubmitting || selectedSeats.length === 0}
            contentStyle={{ height: 50 }}
        >
            {isSubmitting ? "Confirming..." : "Confirm Booking"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#000' },
  headerSubtitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10 },
  legend: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  legendText: { fontSize: 13, fontWeight: '800', color: '#000' },
  legendTextSelected: { fontSize: 13, fontWeight: '800', color: '#fff' },
  grid: { alignItems: 'center', paddingBottom: 20 },
  seat: { margin: 5, width: 70, height: 50, justifyContent: 'center', borderRadius: 8 },
  seatLabel: { fontSize: 14, fontWeight: '900', color: '#000' },
  footer: { paddingVertical: 20, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  totalText: { fontSize: 20, fontWeight: '900', color: '#000', marginBottom: 10 },
  chipAvailable: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ccc' },
  chipSelected: { backgroundColor: '#6200ee', borderWidth: 1, borderColor: '#3700b3' },
  chipOccupied: { backgroundColor: '#ffcdd2', borderWidth: 1, borderColor: '#e57373' }
});

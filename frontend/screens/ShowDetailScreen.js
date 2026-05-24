import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Paragraph, List, Divider } from 'react-native-paper';
import api from '../services/api';

export default function ShowDetailScreen({ route, navigation }) {
  const { show } = route.params;
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        // Updated to use the explicit /showtimes endpoint per requirements
        const response = await api.get(`/shows/showtimes`, { params: { showId: show.show_id } });
        setShowtimes(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchShowtimes();
  }, [show.show_id]);

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{show.title}</Title>
      <Paragraph style={styles.meta}>
        Duration: {show.duration} mins | Rating: {show.age_rating}
      </Paragraph>
      <Paragraph style={styles.description}>{show.description}</Paragraph>

      <Divider style={styles.divider} />

      <Title style={styles.subtitle}>Select Showtime</Title>
      {showtimes.map((st) => (
        <List.Item
          key={st.show_time_id}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDesc}
          style={styles.listItem}
          title={`${new Date(st.show_date).toLocaleDateString()} @ ${st.show_time}`}
          description={`${st.hall_name} - ${st.price}€`}
          left={props => <List.Icon {...props} icon="clock-outline" color="#6200ee" />}
          onPress={() => navigation.navigate('Booking', { show, showtime: st })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#000' },
  meta: { color: '#333', marginBottom: 15, fontWeight: '600', fontSize: 16 },
  description: { marginBottom: 25, fontSize: 15, lineHeight: 22, color: '#444' },
  divider: { marginVertical: 15, height: 1, backgroundColor: '#ddd' },
  subtitle: { fontSize: 20, marginBottom: 15, fontWeight: 'bold', color: '#000' },
  listItem: { borderBottomWidth: 1, borderBottomColor: '#eee' },
  listTitle: { fontWeight: 'bold', color: '#000' },
  listDesc: { color: '#555', fontWeight: '500' }
});

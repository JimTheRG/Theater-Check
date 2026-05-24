import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import api from '../services/api';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (query = '') => {
    setLoading(true);
    try {
      // In a real app, you might want to switch between theaters and shows
      const response = await api.get('/theatres', { params: { query } });
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearch = () => fetchData(searchQuery);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => fetchShowsForTheatre(item.theatre_id)}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.name}</Title>
        <Paragraph style={styles.cardSubtitle}>{item.location}</Paragraph>
        <Paragraph style={styles.cardDescription} numberOfLines={2}>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained-tonal" onPress={() => fetchShowsForTheatre(item.theatre_id)}>View Shows</Button>
      </Card.Actions>
    </Card>
  );

  const fetchShowsForTheatre = async (theatreId) => {
    try {
        const response = await api.get('/shows', { params: { theatreId } });
        // For simplicity, navigating to a list of shows would be next,
        // but let's assume we pick the first show for demo if it exists.
        if (response.data.length > 0) {
            navigation.navigate('ShowDetail', { show: response.data[0] });
        } else {
            alert('No shows available for this theatre.');
        }
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.theatre_id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={() => fetchData()}
      />
      <Button mode="outlined" onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
        My Bookings
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  card: { marginBottom: 15, elevation: 2, backgroundColor: '#fff' },
  cardTitle: {
    fontWeight: '900',
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1
  },
  cardSubtitle: { color: '#444', fontWeight: '600' },
  cardDescription: { color: '#666' },
  profileBtn: { marginTop: 10, borderWidth: 1.5 }
});

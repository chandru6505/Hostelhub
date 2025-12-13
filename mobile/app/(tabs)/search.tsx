import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { Search, MapPin, Star, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Sample images for fallback
  const sampleImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      // Call your search API
      const response = await fetch(`http://localhost:5000/api/hostels/search?q=${query}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        setSearched(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price?.toLocaleString('en-IN') || '0'}/month`;
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hostels, locations, amenities..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            autoFocus
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <ScrollView style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Searching hostels...</Text>
          </View>
        ) : searched && results.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsTitle}>No hostels found</Text>
            <Text style={styles.noResultsSubtitle}>Try different keywords</Text>
          </View>
        ) : (
          results.map((hostel, index) => (
            <TouchableOpacity 
              key={hostel.id} 
              style={styles.resultCard}
              onPress={() => {
                window.location.href = `/hostel/${hostel.id}`;
              }}
            >
              <Image
                source={{ uri: hostel.imageUrl || sampleImages[index % sampleImages.length] }}
                style={styles.resultImage}
              />
              <View style={styles.resultContent}>
                <Text style={styles.resultName}>{hostel.name}</Text>
                <View style={styles.resultLocation}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.resultLocationText}>{hostel.location}</Text>
                </View>
                <View style={styles.resultDetails}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{hostel.rating || 4.0}</Text>
                  </View>
                  <Text style={styles.priceText}>{formatPrice(hostel.pricePerMonth)}</Text>
                </View>
                <Text style={styles.amenitiesText}>
                  {hostel.amenities ? hostel.amenities.slice(0, 3).join(' • ') : ''}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    marginLeft: 12,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  resultContent: {
    padding: 16,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  resultLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  amenitiesText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

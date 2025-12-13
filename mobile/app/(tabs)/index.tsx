import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Search, MapPin, Star, Users, Wifi, Droplets, Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample hostel images for fallback
  const sampleImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  ];

  // Fetch hostels when category changes
  useEffect(() => {
    fetchHostels(selectedCategory);
  }, [selectedCategory]);

  const fetchHostels = async (category = 'all') => {
    try {
      // Use existing API with type parameter
      const url = category === 'all' 
        ? 'http://localhost:5000/api/hostels'
        : `http://localhost:5000/api/hostels?type=${category}`;
      
      console.log("Fetching from:", url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        // Add image URLs to hostels if they don't have one
        const hostelsWithImages = data.data.map((hostel: any, index: number) => ({
          ...hostel,
          imageUrl: hostel.imageUrl || sampleImages[index % sampleImages.length]
        }));
        setHostels(hostelsWithImages);
      }
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHostels(selectedCategory);
  };

  const formatPrice = (price: number) => {
    return `₹${price?.toLocaleString('en-IN') || '0'}/month`;
  };

  const categories = [
    { id: 'all', label: 'All Hostels' },
    { id: 'boys', label: 'Boys Hostels' },
    { id: 'girls', label: 'Girls Hostels' },
    { id: 'co-living', label: 'Co-Living' },
  ];

  // Remove local filtering - now handled by API
  // const filteredHostels = selectedCategory === 'all' 
  //   ? hostels 
  //   : hostels.filter(hostel => hostel.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Find Your Perfect Stay</Text>
          <Text style={styles.subtitle}>Browse hostels near colleges & offices</Text>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchBar}
        onPress={() => router.push('/search')}
      >
        <Search size={20} color="#666" />
        <Text style={styles.searchPlaceholder}>Search hostels, locations, amenities...</Text>
      </TouchableOpacity>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hostels List */}
      <ScrollView 
        style={styles.hostelsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading hostels...</Text>
          </View>
        ) : hostels.length === 0 ? (
          <View style={styles.noResults}>
            <Home size={48} color="#9CA3AF" />
            <Text style={styles.noResultsTitle}>No hostels found</Text>
            <Text style={styles.noResultsSubtitle}>Try a different category</Text>
          </View>
        ) : (
          hostels.map((hostel, index) => (
            <TouchableOpacity 
              key={hostel.id} 
              style={styles.hostelCard}
              onPress={() => {
                window.location.href = `/hostel/${hostel.id}`;
              }}
            >
              <View style={styles.hostelImageContainer}>
                <Image
                  source={{ uri: hostel.imageUrl || sampleImages[index % sampleImages.length] }}
                  style={styles.hostelImage}
                />
                <View style={styles.ratingBadge}>
                  <Star size={12} color="white" fill="white" />
                  <Text style={styles.ratingText}>{hostel.rating || 4.0}</Text>
                </View>
              </View>
              
              <View style={styles.hostelInfo}>
                <Text style={styles.hostelName}>{hostel.name}</Text>
                
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.locationText}>{hostel.location}</Text>
                </View>
                
                <View style={styles.amenitiesContainer}>
                  <View style={styles.amenityItem}>
                    <Users size={14} color="#666" />
                    <Text style={styles.amenityText}>{hostel.type || 'General'}</Text>
                  </View>
                  {hostel.amenities && hostel.amenities.includes('WiFi') && (
                    <View style={styles.amenityItem}>
                      <Wifi size={14} color="#666" />
                      <Text style={styles.amenityText}>WiFi</Text>
                    </View>
                  )}
                  {hostel.amenities && hostel.amenities.includes('AC') && (
                    <View style={styles.amenityItem}>
                      <Droplets size={14} color="#666" />
                      <Text style={styles.amenityText}>AC</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{formatPrice(hostel.pricePerMonth)}</Text>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      window.location.href = `/hostel/${hostel.id}`;
                    }}
                  >
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerContent: {
    marginTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: 'white',
  },
  hostelsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
    marginTop: 12,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  hostelCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hostelImageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  hostelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  hostelInfo: {
    padding: 16,
  },
  hostelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  viewButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
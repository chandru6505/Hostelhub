import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from 'react-native';
import { 
  MapPin, 
  Star, 
  Users, 
  Wifi, 
  Droplets, 
  Shield, 
  Phone, 
  Mail, 
  Globe,
  ArrowLeft,
  Home,
  Utensils,
  Dumbbell,
  BookOpen
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function HostelDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample images for fallback
  const sampleImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  ];

  useEffect(() => {
    fetchHostelDetails();
  }, [id]);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/hostels/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setHostel(data.data);
      } else {
        setError('Hostel not found');
      }
    } catch (error) {
      console.error('Error fetching hostel:', error);
      setError('Failed to load hostel details');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price?.toLocaleString('en-IN') || '0'}/month`;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi size={20} color="#3B82F6" />;
      case 'food': return <Utensils size={20} color="#3B82F6" />;
      case 'gym': return <Dumbbell size={20} color="#3B82F6" />;
      case 'laundry': return <Droplets size={20} color="#3B82F6" />;
      case 'study room': return <BookOpen size={20} color="#3B82F6" />;
      case 'security': return <Shield size={20} color="#3B82F6" />;
      case 'ac': return <Droplets size={20} color="#3B82F6" />;
      default: return <Home size={20} color="#3B82F6" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading hostel details...</Text>
      </View>
    );
  }

  if (error || !hostel) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error || 'Hostel not found'}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="white" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hostel Details</Text>
        <View style={{ width: 40 }} /> {/* Spacer for alignment */}
      </View>

      {/* Hostel Images */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: hostel.imageUrl || sampleImages[0] }}
          style={styles.mainImage}
        />
        <View style={styles.ratingBadge}>
          <Star size={16} color="white" fill="white" />
          <Text style={styles.ratingText}>{hostel.rating || 4.0}</Text>
        </View>
      </View>

      {/* Hostel Info */}
      <View style={styles.content}>
        <Text style={styles.hostelName}>{hostel.name}</Text>
        
        {/* Type and Location */}
        <View style={styles.typeLocationContainer}>
          <View style={styles.typeBadge}>
            <Users size={14} color="white" />
            <Text style={styles.typeText}>{hostel.type || 'General'}</Text>
          </View>
          <View style={styles.location}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>{hostel.location}</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Monthly Rent</Text>
          <Text style={styles.price}>{formatPrice(hostel.pricePerMonth)}</Text>
        </View>

        {/* Availability */}
        <View style={styles.availabilityContainer}>
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: hostel.available ? '#10B981' : '#EF4444' }
          ]}>
            <Text style={styles.availabilityText}>
              {hostel.available ? 'Available Now' : 'Fully Booked'}
            </Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {hostel.amenities && hostel.amenities.map((amenity: string, index: number) => (
              <View key={index} style={styles.amenityItem}>
                {getAmenityIcon(amenity)}
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Safety Features (for girls hostels) */}
        {hostel.type === 'girls' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety Features</Text>
            <View style={styles.safetyFeatures}>
              <View style={styles.safetyItem}>
                <Shield size={20} color="#10B981" />
                <Text style={styles.safetyText}>24/7 Security</Text>
              </View>
              <View style={styles.safetyItem}>
                <Shield size={20} color="#10B981" />
                <Text style={styles.safetyText}>CCTV Surveillance</Text>
              </View>
              <View style={styles.safetyItem}>
                <Users size={20} color="#10B981" />
                <Text style={styles.safetyText}>Female Warden</Text>
              </View>
            </View>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL('tel:+919876543210')}
            >
              <Phone size={20} color="#3B82F6" />
              <Text style={styles.contactText}>+91 98765 43210</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL('mailto:info@hostelhub.com')}
            >
              <Mail size={20} color="#3B82F6" />
              <Text style={styles.contactText}>info@hostelhub.com</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL('https://hostelhub.com')}
            >
              <Globe size={20} color="#3B82F6" />
              <Text style={styles.contactText}>www.hostelhub.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL('tel:+919876543210')}
          >
            <Phone size={20} color="white" />
            <Text style={styles.contactButtonText}>Call Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => {
              // Will implement booking later
              alert('Booking feature coming soon!');
            }}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          ✅ Verified by HostelHub | 🛡️ Secure Booking | 🏆 Top Rated
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    padding: 20,
  },
  hostelName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  typeLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  priceContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  availabilityContainer: {
    marginBottom: 24,
  },
  availabilityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  availabilityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '48%',
  },
  amenityText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  safetyFeatures: {
    gap: 12,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  safetyText: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 12,
    fontWeight: '500',
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

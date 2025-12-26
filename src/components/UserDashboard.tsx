import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Users, Calendar, Wifi, Coffee, Dumbbell } from 'lucide-react';
import { Hotel } from '../App';
import HotelCard from './HotelCard';
import BookingModal from './BookingModal';

const MOCK_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Grand Luxury Hotel',
    location: 'New York, USA',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pricePerNight: 250,
    availableRooms: 8,
    totalRooms: 50,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant']
  },
  {
    id: '2',
    name: 'Modern Comfort Suites',
    location: 'Los Angeles, USA',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1572177215152-32f247303126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pricePerNight: 180,
    availableRooms: 12,
    totalRooms: 40,
    amenities: ['WiFi', 'Breakfast', 'Parking']
  },
  {
    id: '3',
    name: 'Beachside Paradise Resort',
    location: 'Miami, USA',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1729717949780-46e511489c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pricePerNight: 320,
    availableRooms: 5,
    totalRooms: 30,
    amenities: ['WiFi', 'Beach Access', 'Spa', 'Pool']
  },
  {
    id: '4',
    name: 'Downtown Business Hotel',
    location: 'Chicago, USA',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1694595437436-2ccf5a95591f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pricePerNight: 200,
    availableRooms: 15,
    totalRooms: 60,
    amenities: ['WiFi', 'Conference Rooms', 'Gym']
  },
  {
    id: '5',
    name: 'Boutique City Inn',
    location: 'San Francisco, USA',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1649731000184-7ced04998f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pricePerNight: 220,
    availableRooms: 6,
    totalRooms: 25,
    amenities: ['WiFi', 'Rooftop Bar', 'Restaurant']
  },
  {
    id: '6',
    name: 'Mountain View Lodge',
    location: 'Denver, USA',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pricePerNight: 190,
    availableRooms: 10,
    totalRooms: 35,
    amenities: ['WiFi', 'Hiking Trails', 'Fireplace']
  }
];

export default function UserDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(MOCK_HOTELS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Simulate real-time availability updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHotels(prev => prev.map(hotel => ({
        ...hotel,
        availableRooms: Math.max(0, hotel.availableRooms + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = hotels;

    if (searchQuery) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(hotel => hotel.location.includes(selectedLocation));
    }

    filtered = filtered.filter(hotel => 
      hotel.pricePerNight <= maxPrice && hotel.rating >= minRating
    );

    setFilteredHotels(filtered);
  }, [searchQuery, selectedLocation, maxPrice, minRating, hotels]);

  const locations = ['all', ...new Set(hotels.map(h => h.location.split(',')[1]?.trim() || h.location))];

  const handleBookNow = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-[#0D7144] mb-6">Search Hotels</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hotel name or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144] appearance-none bg-white"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Max Price: ${maxPrice}</label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0D7144]"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <label className="text-gray-700">Min Rating:</label>
          <div className="flex gap-2">
            {[0, 4, 4.5, 4.7].map(rating => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  minRating === rating
                    ? 'bg-[#0D7144] text-white border-[#0D7144]'
                    : 'border-gray-300 text-gray-700 hover:border-[#0D7144]'
                }`}
              >
                {rating === 0 ? 'All' : `${rating}+ ⭐`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Found <span className="text-[#0D7144]">{filteredHotels.length}</span> hotels
        </p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600 text-sm">Real-time availability</span>
        </div>
      </div>

      {/* Hotel Grid */}
      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map(hotel => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onBook={() => handleBookNow(hotel)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedHotel && (
        <BookingModal
          hotel={selectedHotel}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedHotel(null);
          }}
        />
      )}
    </div>
  );
}

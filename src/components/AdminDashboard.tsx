import { useState, useEffect } from 'react';
import { Hotel as HotelIcon, Plus, Search, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { Hotel, Booking } from '../App';
import AdminHotelCard from './AdminHotelCard';
import AddHotelModal from './AddHotelModal';

const INITIAL_HOTELS: Hotel[] = [
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
  }
];

export default function AdminDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load hotels from localStorage or use initial data
    const storedHotels = localStorage.getItem('admin_hotels');
    if (storedHotels) {
      setHotels(JSON.parse(storedHotels));
      setFilteredHotels(JSON.parse(storedHotels));
    } else {
      setHotels(INITIAL_HOTELS);
      setFilteredHotels(INITIAL_HOTELS);
      localStorage.setItem('admin_hotels', JSON.stringify(INITIAL_HOTELS));
    }

    // Load all bookings for analytics
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels);
    }
  }, [searchQuery, hotels]);

  const handleAddHotel = (hotel: Omit<Hotel, 'id'>) => {
    const newHotel: Hotel = {
      ...hotel,
      id: `hotel-${Date.now()}`
    };
    const updatedHotels = [...hotels, newHotel];
    setHotels(updatedHotels);
    localStorage.setItem('admin_hotels', JSON.stringify(updatedHotels));
  };

  const handleUpdateHotel = (hotelId: string, updates: Partial<Hotel>) => {
    const updatedHotels = hotels.map(h =>
      h.id === hotelId ? { ...h, ...updates } : h
    );
    setHotels(updatedHotels);
    localStorage.setItem('admin_hotels', JSON.stringify(updatedHotels));
  };

  const handleDeleteHotel = (hotelId: string) => {
    const updatedHotels = hotels.filter(h => h.id !== hotelId);
    setHotels(updatedHotels);
    localStorage.setItem('admin_hotels', JSON.stringify(updatedHotels));
  };

  // Analytics calculations
  const totalRevenue = bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.totalPrice : sum, 0);
  const activeBookings = bookings.filter(b => b.status === 'active').length;
  const totalRooms = hotels.reduce((sum, h) => sum + h.totalRooms, 0);
  const occupiedRooms = hotels.reduce((sum, h) => sum + (h.totalRooms - h.availableRooms), 0);
  const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-[#0D7144] mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage hotels, rooms, pricing, and availability</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
          <p className="text-gray-900">${totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Active Bookings</p>
          <p className="text-gray-900">{activeBookings}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <HotelIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Hotels</p>
          <p className="text-gray-900">{hotels.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Occupancy Rate</p>
          <p className="text-gray-900">{occupancyRate}%</p>
        </div>
      </div>

      {/* Hotel Management */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-[#0D7144]">Hotel Management</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-[#0D7144] text-white rounded-lg hover:bg-[#0a5a36] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Hotel
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotels by name or location..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHotels.map(hotel => (
            <AdminHotelCard
              key={hotel.id}
              hotel={hotel}
              onUpdate={handleUpdateHotel}
              onDelete={handleDeleteHotel}
            />
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <HotelIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hotels found</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddHotelModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddHotel}
        />
      )}
    </div>
  );
}

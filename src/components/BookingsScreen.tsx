import { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Users, DollarSign, Filter } from 'lucide-react';
import { Booking } from '../App';
import { useAuth } from '../App';
import BookingCard from './BookingCard';

type BookingStatus = 'all' | 'active' | 'completed' | 'cancelled';

export default function BookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const stored = localStorage.getItem('bookings');
    if (stored) {
      const allBookings: Booking[] = JSON.parse(stored);
      const userBookings = allBookings.filter(b => b.userId === user?.id);
      setBookings(userBookings);
      setFilteredBookings(userBookings);
    }
  };

  useEffect(() => {
    let filtered = bookings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [statusFilter, searchQuery, bookings]);

  const handleStatusChange = (bookingId: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    const stored = localStorage.getItem('bookings');
    if (stored) {
      const allBookings: Booking[] = JSON.parse(stored);
      const updated = allBookings.map(b =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      );
      localStorage.setItem('bookings', JSON.stringify(updated));
      loadBookings();
    }
  };

  const getStatusCount = (status: BookingStatus) => {
    if (status === 'all') return bookings.length;
    return bookings.filter(b => b.status === status).length;
  };

  const statusButtons: Array<{ value: BookingStatus; label: string; color: string }> = [
    { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-700' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-700' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-[#0D7144] mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your hotel reservations</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hotel name or booking ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600 text-sm">Filter by status:</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusButtons.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === value
                  ? 'bg-[#0D7144] text-white ring-2 ring-[#0D7144] ring-offset-2'
                  : `${color} hover:opacity-80`
              }`}
            >
              {label} ({getStatusCount(value)})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : "You haven't made any bookings yet"}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload(); // Navigate to dashboard
              }}
              className="inline-block px-6 py-3 bg-[#0D7144] text-white rounded-lg hover:bg-[#0a5a36] transition-colors"
            >
              Browse Hotels
            </a>
          )}
        </div>
      )}
    </div>
  );
}

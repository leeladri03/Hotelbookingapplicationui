import { useState } from 'react';
import { X, Calendar, Users, CreditCard } from 'lucide-react';
import { Hotel } from '../App';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../App';

interface BookingModalProps {
  hotel: Hotel;
  onClose: () => void;
}

export default function BookingModal({ hotel, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('Standard');
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const basePrice = hotel.pricePerNight * nights;
  const roomTypeMultiplier = roomType === 'Deluxe' ? 1.5 : roomType === 'Suite' ? 2 : 1;
  const totalPrice = basePrice * roomTypeMultiplier;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (nights < 1) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (guests < 1) {
      toast.error('Please select at least 1 guest');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newBooking = {
      id: `BK${Date.now()}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      userId: user!.id,
      checkIn,
      checkOut,
      roomType,
      guests,
      totalPrice,
      status: 'active' as const,
      bookingDate: new Date().toISOString()
    };

    // Store booking in localStorage for demo
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));

    setIsProcessing(false);
    toast.success(`Booking confirmed! Reference: ${newBooking.id}`);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[#0D7144] mb-1">Book Your Stay</h2>
              <p className="text-gray-600">{hotel.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleBooking} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Number of Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              >
                <option value="Standard">Standard Room</option>
                <option value="Deluxe">Deluxe Room (+50%)</option>
                <option value="Suite">Suite (+100%)</option>
              </select>
            </div>
          </div>

          {nights > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>${hotel.pricePerNight} × {nights} nights</span>
                  <span>${basePrice}</span>
                </div>
                {roomTypeMultiplier > 1 && (
                  <div className="flex justify-between text-gray-600">
                    <span>{roomType} room upgrade</span>
                    <span>×{roomTypeMultiplier}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-300 flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-[#0D7144]">
                  ${(totalPrice + totalPrice * 0.1).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || nights < 1}
              className="flex-1 px-6 py-3 bg-[#0D7144] text-white rounded-lg hover:bg-[#0a5a36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

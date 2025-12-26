import { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Eye, X, CheckCircle } from 'lucide-react';
import { Booking } from '../App';
import ConfirmDialog from './ConfirmDialog';
import { toast } from 'sonner@2.0.3';

interface BookingCardProps {
  booking: Booking;
  onStatusChange: (bookingId: string, newStatus: 'active' | 'completed' | 'cancelled') => void;
}

export default function BookingCard({ booking, onStatusChange }: BookingCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const handleCancel = () => {
    onStatusChange(booking.id, 'cancelled');
    setShowCancelConfirm(false);
    toast.success('Booking cancelled successfully');
  };

  const handleComplete = () => {
    onStatusChange(booking.id, 'completed');
    setShowCompleteConfirm(false);
    toast.success('Booking marked as completed');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusStyle = () => {
    switch (booking.status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Booking Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{booking.hotelName}</h3>
                  <p className="text-gray-500 text-sm">Booking ID: {booking.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm border capitalize ${getStatusStyle()}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-[#0D7144]" />
                  <div className="text-sm">
                    <p className="text-gray-500">Check-in</p>
                    <p className="text-gray-900">{formatDate(booking.checkIn)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-[#0D7144]" />
                  <div className="text-sm">
                    <p className="text-gray-500">Check-out</p>
                    <p className="text-gray-900">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-[#0D7144]" />
                  <div className="text-sm">
                    <p className="text-gray-500">Guests</p>
                    <p className="text-gray-900">{booking.guests}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4 text-[#0D7144]" />
                  <div className="text-sm">
                    <p className="text-gray-500">Total</p>
                    <p className="text-gray-900">${booking.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                {calculateNights()} nights • {booking.roomType} Room • Booked on {formatDate(booking.bookingDate)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:flex-col gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 lg:flex-none px-4 py-2 border border-[#0D7144] text-[#0D7144] rounded-lg hover:bg-[#0D7144] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Details</span>
              </button>

              {booking.status === 'active' && (
                <>
                  <button
                    onClick={() => setShowCompleteConfirm(true)}
                    className="flex-1 lg:flex-none px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete</span>
                  </button>

                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="flex-1 lg:flex-none px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-gray-900 mb-4">Booking Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Confirmation Number</p>
                  <p className="text-gray-900">{booking.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Room Type</p>
                  <p className="text-gray-900">{booking.roomType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Number of Nights</p>
                  <p className="text-gray-900">{calculateNights()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Status</p>
                  <p className={`capitalize ${
                    booking.status === 'active' ? 'text-green-600' :
                    booking.status === 'completed' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
      />

      <ConfirmDialog
        isOpen={showCompleteConfirm}
        onClose={() => setShowCompleteConfirm(false)}
        onConfirm={handleComplete}
        title="Mark as Completed"
        message="Mark this booking as completed? This indicates you have finished your stay."
        confirmText="Mark Complete"
        confirmVariant="primary"
      />
    </>
  );
}

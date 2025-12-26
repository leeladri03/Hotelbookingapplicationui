import { useState } from 'react';
import { MapPin, Star, Edit2, Trash2, DollarSign, Home, TrendingUp, TrendingDown } from 'lucide-react';
import { Hotel } from '../App';
import ConfirmDialog from './ConfirmDialog';
import EditHotelModal from './EditHotelModal';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdminHotelCardProps {
  hotel: Hotel;
  onUpdate: (hotelId: string, updates: Partial<Hotel>) => void;
  onDelete: (hotelId: string) => void;
}

export default function AdminHotelCard({ hotel, onUpdate, onDelete }: AdminHotelCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(hotel.id);
    setShowDeleteConfirm(false);
    toast.success(`${hotel.name} has been deleted`);
  };

  const handleQuickUpdate = (field: 'availableRooms' | 'pricePerNight', value: number) => {
    onUpdate(hotel.id, { [field]: value });
    toast.success('Updated successfully');
  };

  const occupancyRate = ((hotel.totalRooms - hotel.availableRooms) / hotel.totalRooms) * 100;

  return (
    <>
      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-[#0D7144] transition-colors">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-40 h-40 flex-shrink-0">
            <ImageWithFallback
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-gray-900 mb-1">{hotel.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{hotel.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Hotel"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Hotel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-500 text-sm">Price/Night</p>
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-gray-900">${hotel.pricePerNight}</p>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => handleQuickUpdate('pricePerNight', hotel.pricePerNight - 10)}
                    className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                  >
                    -$10
                  </button>
                  <button
                    onClick={() => handleQuickUpdate('pricePerNight', hotel.pricePerNight + 10)}
                    className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                  >
                    +$10
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-500 text-sm">Available</p>
                  <Home className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-gray-900">{hotel.availableRooms}/{hotel.totalRooms}</p>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => handleQuickUpdate('availableRooms', Math.max(0, hotel.availableRooms - 1))}
                    className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                    disabled={hotel.availableRooms === 0}
                  >
                    <TrendingDown className="w-3 h-3 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleQuickUpdate('availableRooms', Math.min(hotel.totalRooms, hotel.availableRooms + 1))}
                    className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                    disabled={hotel.availableRooms === hotel.totalRooms}
                  >
                    <TrendingUp className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#FDC015] fill-current" />
                <span className="text-sm text-gray-600">{hotel.rating}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Occupancy: </span>
                <span className={`${occupancyRate > 70 ? 'text-green-600' : 'text-orange-600'}`}>
                  {occupancyRate.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditHotelModal
          hotel={hotel}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updates) => {
            onUpdate(hotel.id, updates);
            setShowEditModal(false);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Hotel"
        message={`Are you sure you want to delete "${hotel.name}"? This action cannot be undone.`}
        confirmText="Delete Hotel"
        confirmVariant="danger"
      />
    </>
  );
}

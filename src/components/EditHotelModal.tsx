import { useState } from 'react';
import { X } from 'lucide-react';
import { Hotel } from '../App';
import { toast } from 'sonner@2.0.3';

interface EditHotelModalProps {
  hotel: Hotel;
  onClose: () => void;
  onUpdate: (updates: Partial<Hotel>) => void;
}

export default function EditHotelModal({ hotel, onClose, onUpdate }: EditHotelModalProps) {
  const [formData, setFormData] = useState({
    name: hotel.name,
    location: hotel.location,
    rating: hotel.rating,
    image: hotel.image,
    pricePerNight: hotel.pricePerNight,
    availableRooms: hotel.availableRooms,
    totalRooms: hotel.totalRooms,
    amenities: [...hotel.amenities]
  });

  const [amenityInput, setAmenityInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.availableRooms > formData.totalRooms) {
      toast.error('Available rooms cannot exceed total rooms');
      return;
    }

    onUpdate(formData);
    toast.success('Hotel updated successfully!');
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()]
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[#0D7144] mb-1">Edit Hotel</h2>
              <p className="text-gray-600">Update hotel information</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">
                Hotel Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Price per Night ($)</label>
              <input
                type="number"
                min="0"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Total Rooms</label>
              <input
                type="number"
                min="1"
                value={formData.totalRooms}
                onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Available Rooms</label>
              <input
                type="number"
                min="0"
                max={formData.totalRooms}
                value={formData.availableRooms}
                onChange={(e) => setFormData({ ...formData, availableRooms: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Amenities</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144]"
                  placeholder="e.g., WiFi, Pool, Gym"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-6 py-2.5 bg-[#0D7144] text-white rounded-lg hover:bg-[#0a5a36] transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map(amenity => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-[#0D7144] text-white rounded-full text-sm flex items-center gap-2"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

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
              className="flex-1 px-6 py-3 bg-[#0D7144] text-white rounded-lg hover:bg-[#0a5a36] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

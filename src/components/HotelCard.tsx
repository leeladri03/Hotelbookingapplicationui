import { MapPin, Star, Users, Wifi, Coffee, Dumbbell, Utensils } from 'lucide-react';
import { Hotel } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HotelCardProps {
  hotel: Hotel;
  onBook: () => void;
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Gym': Dumbbell,
  'Restaurant': Utensils,
  'Breakfast': Coffee,
  'Pool': Users,
};

export default function HotelCard({ hotel, onBook }: HotelCardProps) {
  const availabilityPercent = (hotel.availableRooms / hotel.totalRooms) * 100;
  const isLowAvailability = availabilityPercent < 30;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <ImageWithFallback
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        {isLowAvailability && (
          <div className="absolute top-3 left-3 bg-[#FDC015] text-gray-900 px-3 py-1 rounded-full text-sm">
            Only {hotel.availableRooms} left!
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-[#FDC015] fill-current" />
          <span>{hotel.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-gray-900 mb-2">{hotel.name}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{hotel.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 4).map(amenity => {
            const Icon = amenityIcons[amenity] || Wifi;
            return (
              <div
                key={amenity}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-700"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{amenity}</span>
              </div>
            );
          })}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Availability</span>
            <span className={`${isLowAvailability ? 'text-red-600' : 'text-green-600'}`}>
              {hotel.availableRooms}/{hotel.totalRooms} rooms
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isLowAvailability ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${availabilityPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-gray-600 text-sm">From</p>
            <p className="text-[#0D7144]">
              ${hotel.pricePerNight}
              <span className="text-gray-600 text-sm">/night</span>
            </p>
          </div>
          <button
            onClick={onBook}
            disabled={hotel.availableRooms === 0}
            className="px-6 py-2 bg-[#0D7144] text-white rounded-lg hover:bg-[#0a5a36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hotel.availableRooms === 0 ? 'Sold Out' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

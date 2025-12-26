import { useState, createContext, useContext, ReactNode } from 'react';
import LoginScreen from './components/LoginScreen';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import BookingsScreen from './components/BookingsScreen';
import ProfileDropdown from './components/ProfileDropdown';
import { Toaster } from 'sonner@2.0.3';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  pricePerNight: number;
  availableRooms: number;
  totalRooms: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
  bookingDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

type Screen = 'login' | 'dashboard' | 'bookings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication
    if (email === 'admin@hotel.com' && password === 'admin123') {
      setUser({
        id: 'admin-1',
        name: 'Admin Manager',
        email: 'admin@hotel.com',
        role: 'admin'
      });
      setCurrentScreen('dashboard');
      return true;
    } else if (email === 'user@hotel.com' && password === 'user123') {
      setUser({
        id: 'user-1',
        name: 'John Doe',
        email: 'user@hotel.com',
        role: 'user'
      });
      setCurrentScreen('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-gray-50">
        {user && (
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-8">
                  <h1 className="text-[#0D7144]">Hotel Booking System</h1>
                  <nav className="flex gap-4">
                    <button
                      onClick={() => setCurrentScreen('dashboard')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentScreen === 'dashboard'
                          ? 'bg-[#0D7144] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Dashboard
                    </button>
                    {user.role === 'user' && (
                      <button
                        onClick={() => setCurrentScreen('bookings')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentScreen === 'bookings'
                            ? 'bg-[#0D7144] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        My Bookings
                      </button>
                    )}
                  </nav>
                </div>
                <ProfileDropdown />
              </div>
            </div>
          </header>
        )}

        <main>
          {currentScreen === 'login' && <LoginScreen />}
          {currentScreen === 'dashboard' && user?.role === 'user' && <UserDashboard />}
          {currentScreen === 'dashboard' && user?.role === 'admin' && <AdminDashboard />}
          {currentScreen === 'bookings' && user?.role === 'user' && <BookingsScreen />}
        </main>

        <Toaster position="top-right" richColors />
      </div>
    </AuthContext.Provider>
  );
}

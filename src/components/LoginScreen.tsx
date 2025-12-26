import { useState } from 'react';
import { useAuth } from '../App';
import { toast } from 'sonner@2.0.3';
import { Hotel, Lock, Mail } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials. Try admin@hotel.com / admin123 or user@hotel.com / user123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D7144] to-[#0a5a36] px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0D7144] rounded-full mb-4">
              <Hotel className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[#0D7144]">Hotel Booking System</h2>
            <p className="text-gray-600 mt-2">Sign in to manage your reservations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144] focus:border-transparent"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7144] focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0D7144] text-white py-3 rounded-lg hover:bg-[#0a5a36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-center mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700"><strong>User:</strong> user@hotel.com / user123</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700"><strong>Admin:</strong> admin@hotel.com / admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { programsAPI } from '../services/api';
import { Program } from '../types';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's programs
    programsAPI.list()
      .then(setPrograms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Strength Programs</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.full_name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {user?.full_name}! 👋
            </h2>
            
            <button
              onClick={() => navigate('/programs/create')}
              className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
            >
              + Create New Program
            </button>
          </div>

          {/* Programs List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Your Programs
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading programs...</p>
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-600 mb-4">
                  You haven't created any programs yet.
                </p>
                <button
                  onClick={() => navigate('/programs/create')}
                  className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  Create Your First Program
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    onClick={() => navigate(`/programs/${program.id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 hover:shadow-md transition cursor-pointer bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {program.name || 'The Battleship Program'}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        program.status === 'active' ? 'bg-green-100 text-green-800' :
                        program.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {program.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Type:</span> {program.program_type}
                      </p>
                      <p>
                        <span className="font-medium">Lifts:</span> {program.config?.num_lifts || 'N/A'}
                      </p>
                      <p>
                        <span className="font-medium">Created:</span> {formatDate(program.created_at)}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs text-gray-500">
                        Click to view program details →
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
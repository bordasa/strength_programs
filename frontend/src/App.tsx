import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreateProgramPage from './pages/CreateProgramPage'
import ProgramViewPage from './pages/ProgramViewPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programs/create"
              element={
                <ProtectedRoute>
                  <CreateProgramPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programs/:id"
              element={
                <ProtectedRoute>
                  <ProgramViewPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Landing page
function LandingPage() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Strength Programs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional strength training programs powered by The Battleship methodology
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/login"
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border-2 border-gray-900 hover:bg-gray-50 transition"
            >
              Get Started
            </a>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="text-3xl mb-4">🎲</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Battleship Method
            </h3>
            <p className="text-gray-600">
              Dice-based volume variation for optimal strength gains
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              For Coaches & Athletes
            </h3>
            <p className="text-gray-600">
              Coaches create programs, athletes follow them
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Monitor your strength journey week by week
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 tracking-tight">
              Access Required
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light mb-12">
              You need to be signed in to access this feature
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-white mb-4">
                  Sign In Required
                </h2>
                <p className="text-gray-300 mb-8">
                  Please sign in or create an account to access this page
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  to="/auth"
                  className="w-full block py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-center hover:from-cyan-400 hover:to-purple-500 transition-all duration-300"
                >
                  Sign In / Sign Up
                </Link>
                
                <Link
                  to="/"
                  className="w-full block py-4 px-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-center hover:bg-white/20 transition-all duration-300"
                >
                  Go Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

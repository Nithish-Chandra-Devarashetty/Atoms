import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const TestAuth = () => {
  const { currentUser, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Authentication Test</h1>
        
        {currentUser ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-green-600 font-medium">You are logged in!</p>
              <p className="text-gray-600 mt-2">Email: {currentUser.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">You are not logged in.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface ProfilePhotoUploadProps {
  currentPhotoURL?: string;
  onPhotoUpdate: (url: string) => void;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ 
  currentPhotoURL, 
  onPhotoUpdate 
}) => {
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { currentUser } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);
    try {
      // For now, we'll use a placeholder URL
      // In a real implementation, you'd upload to a cloud storage service
      const placeholderURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.displayName}`;
      
      await apiService.updateProfile({ photoURL: placeholderURL });
      onPhotoUpdate(placeholderURL);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          {currentPhotoURL ? (
            <img 
              src={currentPhotoURL} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl font-bold">
              {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Update Profile Photo</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <label className="block w-full p-4 border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg cursor-pointer text-center transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <span className="text-gray-300">
                {uploading ? 'Updating...' : 'Click to update photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Photo upload will generate an avatar based on your name
            </p>
          </div>
        </div>
      )}
    </>
  );
};
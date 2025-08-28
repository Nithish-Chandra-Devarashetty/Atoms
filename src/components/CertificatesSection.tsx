import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Download, Award, Calendar, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface Certificate {
  type: string;
  issuedDate: string;
  certificateId: string;
  downloadUrl: string;
}

interface CertificatesSectionProps {
  userProgress?: any;
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ userProgress }) => {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [webDevEligibility, setWebDevEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchCertificates();
      checkWebDevEligibility();
    }
  }, [currentUser]);

  const fetchCertificates = async () => {
    try {
      const response = await apiService.getUserCertificates();
      setCertificates(response.certificates || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWebDevEligibility = async () => {
    try {
      const response = await apiService.checkWebDevEligibility();
      setWebDevEligibility(response);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const handleGenerateCertificate = async () => {
    setGenerating(true);
    try {
      const response = await apiService.generateWebDevCertificate();
      setCertificates(prev => [...prev, response.certificate]);
      setWebDevEligibility(prev => ({ ...prev, hasExistingCertificate: true, eligible: false }));

      // Auto-download using direct PDF download
      try {
        await apiService.downloadWebDevCertificate();
      } catch (downloadError) {
        console.error('Direct download failed, trying fallback:', downloadError);
        // Fallback to signed URL if direct download fails
        try {
          const signed = await apiService.getSignedWebDevCertificateUrl();
          window.open(signed.url, '_blank');
        } catch {
          window.open(response.certificate.downloadUrl, '_blank');
        }
      }
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      alert(error.message || 'Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  // Direct download for existing certificates
  const handleOpenCertificate = async (cert: Certificate) => {
    try {
      // Use direct download for production-ready approach
      await apiService.downloadWebDevCertificate();
    } catch (e) {
      console.error('Direct download failed, trying fallback:', e);
      try {
        // Fallback to signed URL 
        const signed = await apiService.getSignedWebDevCertificateUrl();
        window.open(signed.url, '_blank');
      } catch {
        // Final fallback: stored URL (for development)
        window.open(cert.downloadUrl, '_blank');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCertificateTitle = (type: string) => {
    switch (type) {
      case 'webdev':
        return 'Web Development Mastery Program';
      case 'core':
        return 'Core Computer Science';
      case 'dsa':
        return 'Data Structures & Algorithms';
      case 'aptitude':
        return 'Quantitative Aptitude';
      default:
        return 'Certificate';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Award className="w-6 h-6 mr-2 text-yellow-400" />
        Certificates & Achievements
      </h3>

      {/* Web Development Certificate Section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Web Development Certificate</h4>
          
          {webDevEligibility?.hasExistingCertificate ? (
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">Earned</span>
            </div>
          ) : webDevEligibility?.eligible ? (
            <button
              onClick={handleGenerateCertificate}
              disabled={generating}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center text-gray-400">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">Complete all modules to unlock</span>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-300">
          {webDevEligibility?.completed ? (
            <p className="text-green-400">
              ✅ Congratulations! You've completed all 6 web development modules.
            </p>
          ) : (
            <p>
              Complete all 6 modules (HTML, CSS, JavaScript, React, Node.js, MongoDB) to earn your certificate.
            </p>
          )}
        </div>

        {/* Progress indicator */}
        {userProgress && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Overall Progress</span>
              <span>{webDevEligibility?.completed ? '100%' : 'In Progress'}</span>
            </div>
            <div className="w-full bg-gray-700 h-2">
              <div 
                className={`h-2 ${webDevEligibility?.completed ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-300`}
                style={{ 
                  width: webDevEligibility?.completed ? '100%' : '75%' // Adjust based on actual progress
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Earned Certificates */}
      {certificates.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Your Certificates</h4>
          
          {certificates.map((cert) => (
            <div 
              key={cert.certificateId} 
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Award className="w-8 h-8 text-yellow-400 mr-4" />
                <div>
                  <h5 className="font-semibold text-white">{getCertificateTitle(cert.type)}</h5>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Issued on {formatDate(cert.issuedDate)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Certificate ID: {cert.certificateId}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenCertificate(cert)}
                  className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors duration-300"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
                
                <button
                  onClick={() => handleOpenCertificate(cert)}
                  className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {certificates.length === 0 && !webDevEligibility?.eligible && (
        <div className="text-center py-8 text-gray-400">
          <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No certificates earned yet</p>
          <p className="text-sm">
            Complete learning modules to earn certificates and showcase your achievements!
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificatesSection;

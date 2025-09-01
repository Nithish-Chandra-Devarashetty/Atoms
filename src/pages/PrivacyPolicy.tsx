import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <h1 className="heading-font text-5xl font-black text-white">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xl text-gray-300">
              Your privacy is important to us. Learn how we protect your data.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">Introduction</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              At Atoms, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              learning platform located in Hyderabad, Telangana, India.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name and email address when you create an account</li>
                  <li>Profile information including profile pictures</li>
                  <li>Learning progress and quiz results</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Pages visited and features used</li>
                  <li>Time spent on different sections</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Provide and maintain our learning platform</li>
              <li>Personalize your learning experience</li>
              <li>Track your progress and provide analytics</li>
              <li>Send important updates and notifications</li>
              <li>Improve our services and develop new features</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">Data Security</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, 
              secure servers, and regular security audits.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">Your Rights</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your learning data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed">
              We use Firebase for authentication and data storage, which is governed by Google's privacy policy. 
              We may also use analytics services to improve our platform. We do not sell your personal information 
              to third parties.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies and Local Storage</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and local storage to enhance your experience, remember your preferences, and track your 
              learning progress. You can control cookie settings through your browser, but some features may not 
              function properly if cookies are disabled.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            </div>
            <div className="text-gray-300 space-y-2">
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 space-y-2">
                <p><strong>Email:</strong> nithishchandra16@gmail.com</p>
                <p><strong>Address:</strong> Hyderabad, Telangana, India</p>
                <p><strong>Phone:</strong> +91 93916 35482</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this 
              Privacy Policy periodically for any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
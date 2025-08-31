import React from 'react';
import { Link } from 'react-router-dom';

export const Contact: React.FC = () => {
  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0">
  <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 blur-3xl animate-pulse"></div>
  <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
  <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">← Back to Home</Link>
          <h1 className="mt-4 text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Contact Us</h1>
          <p className="text-sm text-gray-400 mt-2">We usually respond within 2 business days.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 text-gray-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">Reach Us</h2>
            <p>Email: nithishchandra16@gmail.com</p>
            <p>Phone: +91 93916 35482</p>
            <p>Address: Hyderabad, Telangana, India</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">Message</h2>
            <p>For support or feedback, send us an email with your account email and a brief description. We’ll get back to you soon.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;

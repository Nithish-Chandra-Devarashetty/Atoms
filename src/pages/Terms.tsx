import React from 'react';
import { Link } from 'react-router-dom';

export const Terms: React.FC = () => {
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
          <h1 className="heading-font mt-4 text-5xl font-black text-white">Terms of Service</h1>
          <p className="text-sm text-gray-400 mt-2">Last updated: August 2025</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using Atoms, you agree to these Terms of Service. If you do not agree, do not use the platform.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">2. Use of the Platform</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>You must create an account to access certain features.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You agree not to misuse the platform, including attempting to disrupt services.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">3. User Content</h2>
            <p>You retain ownership of content you submit. By posting, you grant Atoms a license to use, display, and distribute your content within the platform.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">4. Intellectual Property</h2>
            <p>All materials, trademarks, and content on Atoms are owned by Atoms or its licensors and are protected by IP laws.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">5. Termination</h2>
            <p>We may suspend or terminate access for violations of these terms or other harmful behavior.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">6. Disclaimer</h2>
            <p>The platform is provided "as is" without warranties. We are not liable for indirect or consequential damages.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">7. Changes to Terms</h2>
            <p>We may update these terms periodically. Continued use after changes constitutes acceptance.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">8. Contact</h2>
            <p>Questions about these terms? Contact us at nithishchandra16@gmail.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;

import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="relative">
                <Atom size={32} className="text-cyan-400" />
                <div className="absolute -inset-1 bg-cyan-400/20 blur-sm opacity-100"></div>
              </div>
              <span className="ml-3 text-2xl font-black text-white tracking-tight">Atoms</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your AI-powered, gamified learning companion for mastering web development, 
              computer science, DSA, and aptitude skills.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-black text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/webdev" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/core" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Core CS
                </Link>
              </li>
              <li>
                <Link to="/dsa" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  DSA Practice
                </Link>
              </li>
              <li>
                <Link to="/aptitude" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Aptitude Tests
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-black text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-black text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                <span>Hyderabad, Telangana, India</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                <span>nithishchandra@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-2 text-cyan-400" />
                <span>+91 93916 35482</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-5 h-5 text-pink-400" />
                </a>
                <a
                  href="https://www.linkedin.com/in/nithishchandra7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Atoms. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
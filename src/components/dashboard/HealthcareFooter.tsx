import React from "react";
import { Link } from "react-router-dom";

export const HealthcareFooter: React.FC = () => {
  return (
    <footer className="mt-16 bg-phase2-soft-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-raleway font-semibold mb-4">
              ProfileIQ
            </h3>
            <p className="text-gray-300 font-raleway text-sm">
              Intelligent healthcare provider profile management for the modern
              medical professional.
            </p>
          </div>
          <div>
            <h4 className="font-raleway font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-white font-raleway text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-white font-raleway text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white font-raleway text-sm transition-colors"
                >
                  Help & Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-raleway font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 font-raleway text-sm">
                support@profileiq.com
              </li>
              <li className="text-gray-300 font-raleway text-sm">
                1-800-PROFILE
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300 font-raleway text-sm">
            © 2024 ProfileIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

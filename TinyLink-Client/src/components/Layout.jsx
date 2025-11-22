import React from "react";
import { Link } from "react-router-dom";

/**
 * Main application layout component providing consistent header and footer.
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-150"
          >
            TinyLink
          </Link>
          <nav className="space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium"
            >
              Dashboard
            </Link>
            <a
              href="/healthz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium"
            >
              Health Check
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TinyLink URL Shortener-Made by Avinash Saroj
        </div>
      </footer>
    </div>
  );
};

export default Layout;

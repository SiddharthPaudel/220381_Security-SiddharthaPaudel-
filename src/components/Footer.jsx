import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#FFF5E1] text-gray-700 py-12 px-6 font-montserrat">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#FF4C4C' }}>
            Comic Zone
          </h2>
          <p className="text-sm text-gray-600">
            Your go-to hub for all comic lovers. Enjoy reading with smooth visuals and a rich interface.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/explore" className="hover:text-[#FF4C4C]">
                Explore
              </a>
            </li>
            <li>
              <a href="/bookmark" className="hover:text-[#FF4C4C]">
                Bookmarks
              </a>
            </li>
            <li>
              <a href="/account" className="hover:text-[#FF4C4C]">
                My Account
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#FF4C4C]">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Do You Need Help? */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Do You Need Help?</h3>
          <p className="text-sm text-gray-600 mb-2">
            We're here for you! If you're facing issues or have questions, reach out anytime.
          </p>
          <Link
            to="/support"
            className="inline-block mt-2 text-sm hover:underline"
            style={{ color: '#FFC107' }}
          >
            Visit Support Page →
          </Link>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Connect</h3>
          <p className="text-sm text-gray-600 mb-2">Follow us on:</p>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="hover:text-[#FF4C4C]">
              Facebook
            </a>
            <a href="#" className="hover:text-[#FF4C4C]">
              Instagram
            </a>
            <a href="#" className="hover:text-[#FF4C4C]">
              Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} Comic Zone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import main from '../images/zen.webp';
import main1 from '../images/spider1.png';
const HeroSection = () => {
  return (
    <div
      className="flex flex-col-reverse items-center justify-between gap-6 px-6 py-16 md:flex-row md:gap-8 md:px-16 lg:px-24"
      style={{ backgroundColor: '#FFF5E1' }}
    >
      {/* Left Text Content */}
      <div className="w-full md:w-1/2 text-center md:text-left font-montserrat">
        <p className="text-base text-[#FF4C4C] mb-3">Discover the New</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#333333] leading-tight mb-4">
          Find Your Favorite <br />
          Comics At ComicZone
        </h1>
        <button
          className="mt-4 rounded-lg px-8 py-3 text-lg font-semibold transition hover:brightness-110"
          style={{ backgroundColor: '#FFDD00', color: '#333333' }}
        >
          Explore Now
        </button>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={main1}
          alt="Hero"
          className="max-w-full h-auto rounded- shadow-"
        />
      </div>
    </div>
  );
};

export default HeroSection;

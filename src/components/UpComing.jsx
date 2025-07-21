import React from 'react';
import characterLeft from '../images/super.png';     // Replace with your actual image
import characterRight from '../images/bat.png';   // Replace with your actual image
import onepiece from '../images/civilwar.jpg';
import aot from '../images/wolverine.webp';
import mha from '../images/invincible.png';

const comics = [
  {
    id: 1,
    title: "New Chapter of 'Civil War' Released",
    image: onepiece,
    description: "Read the latest chapter of the epic 'One Piece' saga. Join Luffy and his crew on their new adventure!",
    date: "October 15, 2021",
    bgColor: "bg-red-400",
  },
  {
    id: 2,
    title: "Exciting Release: 'Wolverine X Spiderman' Finale",
    image: aot,
    description: "Witness the thrilling conclusion of 'Attack on Titan'. Find out the fate of Eren and the world!",
    date: "October 20, 2021",
    bgColor: "bg-blue-300",
  },
  {
    id: 3,
    title: "Fresh Comic Alert: 'My Hero Academia'",
    image: mha,
    description: "Discover the newest chapter of 'My Hero Academia'. Follow Deku and his friends on new adventures!",
    date: "October 25, 2021",
    bgColor: "bg-yellow-300",
  },
];

const UpcomingComic = () => {
  return (
    <div className="bg-[#FFF5E1] py-20 px-4 font-montserrat relative overflow-hidden">
      {/* Left Character */}
      <img
        src={characterLeft}
        alt="Left Character"
        className="absolute left-0 bottom-0 h-[260px] object-contain hidden md:block z-0"
      />

      {/* Right Character */}
      <img
        src={characterRight}
        alt="Right Character"
        className="absolute right-0 bottom-0 h-[260px] object-contain hidden md:block z-0"
      />

      <h2 className="text-3xl text-[#333333] font-bold text-center mb-10 z-10 relative">
        Upcoming Comic Highlights
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4 z-10 relative">
        {comics.map((comic) => (
          <div
            key={comic.id}
            className="rounded-2xl shadow-lg overflow-hidden transition hover:scale-105"
          >
            {/* Top Color Banner */}
            <div className={`${comic.bgColor} p-3`}>
              <img src={comic.image} alt={comic.title} className="w-full h-40 object-cover rounded-lg" />
            </div>

            {/* Content */}
            <div className="bg-white p-4">
              <h3 className="text-lg font-bold text-[#333333] mb-2">{comic.title}</h3>
              <p className="text-sm text-gray-700 mb-3">{comic.description}</p>
              <p className="text-xs text-gray-500">{comic.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingComic;

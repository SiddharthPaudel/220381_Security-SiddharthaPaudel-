import React, { useEffect, useRef, useState } from 'react';
import animeCharacter from '../images/woman.png'; // Replace with your actual path

const stats = [
  { id: 1, name: 'Visitors Every 24 Hours', value: '44 visitors' },
  { id: 2, name: 'Rent Your Comics', value: '5% Off' },
  { id: 3, name: 'New Comics Added', value: '35 chapters' },
];

const Daily = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div
      className="bg-[#FFF5E1] py-24 px-6 sm:py-32 flex flex-col lg:flex-row items-center justify-center gap-12 font-montserrat"
      ref={sectionRef}
    >
      {/* Left Character */}
      <div className="lg:w-[40%] flex justify-center">
        <img
          src={animeCharacter}
          alt="Comic Character"
          className="h-80 object-contain animate-fade-in"
        />
      </div>

      {/* Right Stats */}
      <div className="lg:w-[60%] w-full -ml-4 lg:-ml-10">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-left lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`mx-auto flex max-w-xs flex-col gap-y-4 transition-opacity duration-700 ${
                isVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <dt className="text-base text-[#FF4C4C]">{stat.name}</dt>
             <dd className="order-first text-3xl font-bold tracking-tight text-[#333333] sm:text-5xl whitespace-nowrap">
  {stat.value}
</dd>

            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default Daily;

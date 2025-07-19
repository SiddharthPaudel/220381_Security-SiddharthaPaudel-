import React from "react";
import { motion } from "framer-motion";
import characterImage from "../images/comicabout.png";

const AboutUs = () => {
  return (
    <section className="bg-[#FFF5E1] py-16 px-6 font-montserrat text-[#333333]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Text Content (Left Side) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 text-left"
        >
          <h2 className="text-3xl font-bold text-[#FF4C4C] mb-4">
            About Comic Zone
          </h2>
          <p className="text-base text-gray-700">
            Comic Zone is your digital destination for comics. Read, rent, and enjoy your favorite stories with clean visuals and an immersive, playful experience. Whether you're into superheroes, fantasy, or slice-of-life, we’ve built this platform for comic fans like you.
          </p>
        </motion.div>

        {/* Character Image (Right Side) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex justify-center"
        >
          <img
            src={characterImage}
            alt="Comic Character"
            className="w-[250px] md:w-[320px] rounded-xl hover:scale-105 transition-transform duration-300 "
          />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;

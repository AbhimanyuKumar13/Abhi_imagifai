import React, { useState } from "react";
import { assets, testimonialsData } from "../assets/assets";
import { motion } from "motion/react";

export const Testimonials = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-20 px-4"
    >
      <h1 className="text-3xl sm:text-4xl font-semibold text-center">
        Customer Testimonials
      </h1>
      <p className="text-gray-500 mb-10 text-center">
        What our users say
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        {testimonialsData.map((testimonial, index) => {
          const shortText =
            testimonial.text.length > 100
              ? testimonial.text.slice(0, 100) + "..."
              : testimonial.text;

          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className="bg-white/20 p-6 rounded-lg shadow-md border w-72 sm:w-80 cursor-pointer hover:scale-[1.02] transition-all"
            >
              <div className="flex flex-col items-center">
                <img
                  src={testimonial.image}
                  alt="img"
                  className="rounded-full w-14"
                />
                <h2 className="text-lg font-semibold mt-3">
                  {testimonial.name}
                </h2>
                <p className="text-gray-400 text-sm mb-3">
                  {testimonial.role}
                </p>

                <div className="flex mb-3">
                  {Array(testimonial.stars)
                    .fill()
                    .map((_, i) => (
                      <img
                        key={i}
                        src={assets.rating_star}
                        alt="star"
                        className="w-4 h-4"
                      />
                    ))}
                </div>

                <p className="text-center text-sm text-gray-600 mb-2">
                  {isExpanded ? testimonial.text : shortText}
                </p>

                {testimonial.text.length > 100 && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="text-blue-500 text-sm hover:underline focus:outline-none"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

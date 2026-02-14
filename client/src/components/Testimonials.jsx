import React, { useState } from "react";
import { assets, testimonialsData } from "../assets/assets";
import { motion } from "motion/react";
import styles from "./Testimonials.module.css";

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
      className={styles.container}
    >
      <h1 className={styles.heading}>
        Customer Testimonials
      </h1>

      <p className={styles.subheading}>
        What our users say
      </p>

      <div className={styles.grid}>
        {testimonialsData.map((testimonial, index) => {
          const shortText =
            testimonial.text.length > 100
              ? testimonial.text.slice(0, 100) + "..."
              : testimonial.text;

          const isExpanded = expandedIndex === index;

          return (
            <div key={index} className={styles.card}>
              <div className={styles.cardContent}>
                <img
                  src={testimonial.image}
                  alt="img"
                  className={styles.avatar}
                />

                <h2 className={styles.name}>
                  {testimonial.name}
                </h2>

                <p className={styles.role}>
                  {testimonial.role}
                </p>

                <div className={styles.stars}>
                  {Array(testimonial.stars)
                    .fill()
                    .map((_, i) => (
                      <img
                        key={i}
                        src={assets.rating_star}
                        alt="star"
                        className={styles.star}
                      />
                    ))}
                </div>

                <p className={styles.text}>
                  {isExpanded ? testimonial.text : shortText}
                </p>

                {testimonial.text.length > 100 && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className={styles.button}
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

import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import styles from "./Description.module.css";

export const Description = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={styles.container}
    >
      <h1 className={styles.heading}>
        Create AI Images
      </h1>

      <p className={styles.subheading}>
        Turn your imagination into visuals
      </p>

      <div className={styles.content}>
        <img
          src={assets.sample_img_1}
          alt="img"
          className={styles.image}
        />

        <div>
          <h2 className={styles.title}>
            Introducing AI-Powered Text to Image Generator
          </h2>

          <p className={styles.paragraph}>
            Easily bring your ideas to life with our free AI image generator.
            Whether you need stunning visuals or unique imagery, our tool
            transforms your text into eye-catching images with just a few clicks.
            Imagine it, describe it, and watch it come to life instantly.
          </p>

          <p className={styles.paragraph}>
            Simply type in the text prompt, and our cutting-edge AI will generate
            high-quality images in seconds. From product visuals to character
            designs and portraits, even concepts that don't yet exist can be
            visualized effortlessly. Powered by advanced AI technology, the
            creative possibilities are limitless!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

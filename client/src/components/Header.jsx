import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export const Header = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (user) {
      navigate("/result");
    } else {
      navigate("/auth");
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className={styles.badge}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p>Best Text to image generator</p>
        <img src={assets.star_icon} alt="star_icon" />
      </motion.div>

      <motion.h1 className={styles.heading}>
        Turn texts to{" "}
        <span className={styles.highlight}>
          image
        </span>
        , in seconds.
      </motion.h1>

      <motion.p
        className={styles.subtext}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Unleash your creativity with AI. Turn your imagination into visual art
        in seconds - just type, and watch the magic happen.
      </motion.p>

      <motion.button
        onClick={onClickHandler}
        className={styles.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          default: { duration: 0.5 },
          opacity: { delay: 0.8, duration: 1 },
        }}
      >
        Generates images
        <img
          className={styles.buttonIcon}
          src={assets.star_group}
          alt="star_group"
        />
      </motion.button>

      <motion.div
        className={styles.previewGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {Array(6)
          .fill("")
          .map((item, index) => (
            <motion.img
              whileHover={{ scale: 1.05, duration: 0.1 }}
              className={styles.previewImage}
              src={
                index % 2 === 0
                  ? assets.sample_img_1
                  : assets.sample_img_2
              }
              key={index}
              alt="sample_imgs"
              width={70}
            />
          ))}
      </motion.div>

      <motion.p
        className={styles.caption}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Generated images from imagifai
      </motion.p>
    </motion.div>
  );
};

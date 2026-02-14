import React from "react";
import { stepsData } from "../assets/assets";
import { motion } from "motion/react";
import styles from "./Steps.module.css";

export const Steps = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={styles.container}
    >
      <h1 className={styles.heading}>
        How it Works
      </h1>

      <p className={styles.subheading}>
        Transform words into Stunning Images
      </p>

      <div className={styles.stepsGrid}>
        {stepsData.map((item, index) => (
          <div key={index} className={styles.card}>
            <img
              src={item.icon}
              alt="item_icon"
              className={styles.icon}
            />
            <div>
              <h2 className={styles.title}>{item.title}</h2>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

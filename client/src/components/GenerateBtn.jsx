import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import styles from "./GenerateBtn.module.css";

const GenerateBtn = () => {
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
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={styles.container}
    >
      <h1 className={styles.heading}>
        See the magic. Try now
      </h1>

      <button
        onClick={onClickHandler}
        className={styles.button}
      >
        Generate Images
        <img
          src={assets.star_group}
          alt="star_group"
          className={styles.icon}
        />
      </button>
    </motion.div>
  );
};

export default GenerateBtn;

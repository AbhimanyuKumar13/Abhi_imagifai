import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <img
          src={assets.imagifai}
          alt="Imagifai Logo"
          className={styles.logo}
          loading="lazy"
        />

        <p className={styles.copyright}>
          © {currentYear} Pandit Soft Solution. All rights reserved.
        </p>

        <div className={styles.contact}>
          <p className={styles.tagline}>
            Product of{" "}
            <Link
              to="https://panditsoftsolution.online/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit developer portfolio"
              className={styles.Org}
            >
              Pandit Soft Solution
            </Link>
          </p>

          <Link
            to="https://panditsoftsolution.online/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit developer portfolio"
          >
            <img
              src={assets.profile_icon}
              alt="Developer Profile"
              className={styles.profileIcon}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

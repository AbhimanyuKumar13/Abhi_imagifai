import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import styles from "./NavBar.module.css";

export const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout, credit } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const getColorFromName = (name) => {
    const colors = [
      styles.red,
      styles.green,
      styles.blue,
      styles.yellow,
      styles.purple,
      styles.pink,
      styles.indigo,
      styles.teal,
      styles.orange,
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Link to="/">
        <img
          src={assets.imagifai}
          className={styles.logo}
          alt="logo"
        />
      </Link>

      <div>
        {user ? (
          <div className={styles.authSection}>
            <button
              onClick={() => navigate("/buy")}
              className={styles.creditButton}
            >
              <img
                className={styles.creditIcon}
                src={assets.credit_star}
                alt="credit_star"
              />
              <p className={styles.creditText}>
                Credits Left : {credit}
              </p>
            </button>

            <p className={styles.greeting}>
              Hii, {user.name}
            </p>

            <div className={styles.profileWrapper} ref={menuRef}>
              <div
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`${styles.profileCircle} ${getColorFromName(
                  user.name
                )}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {menuOpen && (
                <div className={styles.dropdown}>
                  <ul className={styles.dropdownList}>
                    <li
                      onClick={logout}
                      className={styles.dropdownItem}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.guestSection}>
            <p
              onClick={() => navigate("/buy")}
              className={styles.pricing}
            >
              Pricing
            </p>

            <button
              onClick={() => navigate("/auth")}
              className={styles.loginButton}
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

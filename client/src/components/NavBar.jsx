import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout, credit } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Function to get a color based on the user's name
  const getColorFromName = (name) => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Close dropdown on outside click
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
    <div className="flex justify-between items-center py-4">
      <Link to="/">
        <img src={assets.imagifai} className="w-28 sm:w-32 lg:w-40" alt="logo" />
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Credits Button */}
            <button
              onClick={() => navigate("/buy")}
              className="flex items-center gap-2 sm:gap-3 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-400 cursor-pointer"
            >
              <img className="w-5" src={assets.credit_star} alt="credit_star" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Credits Left : {credit}
              </p>
            </button>

            {/* Greeting */}
            <p className="text-gray-600 max-sm:hidden pl-4">Hii, {user.name}</p>

            {/* Profile Circle with Dropdown */}
            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold cursor-pointer ${getColorFromName(
                  user.name
                )}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {menuOpen && (
                <div className="absolute top-12 right-0 z-10 text-black rounded shadow-lg">
                  <ul className="list-none m-0 py-1 font-medium px-2 bg-white rounded-lg border text-sm">
                    <li
                      onClick={logout}
                      className="px-2 py-1 cursor-pointer pr-5 hover:bg-gray-100 rounded"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Not Logged In */
          <div className="flex items-center gap-2 sm:gap-5">
            <p onClick={() => navigate("/buy")} className="cursor-pointer">
              Pricing
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-lg rounded-full cursor-pointer"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

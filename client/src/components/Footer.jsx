import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 mt-20">
      <img src={assets.imagifai} alt="logo" width={150} />
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
        Copyright @Abhi.dev | All right reserved.
      </p>
      <div className="flex gap-2.5">
        <p className="flex items-center justify-center pl-4 text-sm text-gray-500 max-sm:hidden">
          Contact to Devloper
        </p>
        <Link target="blank" to={"https://abhi050505.netlify.app/"}>
          <img src={assets.profile_icon} width={35} />
        </Link>
      </div>
    </div>
  );
};

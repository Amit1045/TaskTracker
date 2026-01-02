import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
<Link to={'/'}>
        <div className="flex items-center gap-2">
          <FiCheckCircle className="text-blue-600 text-xl" />
          <h1 className="text-xl font-bold text-gray-800">
            Task<span className="text-blue-600">Tracker</span>
          </h1>
        </div>
        </Link>
     
      </div>
    </header>
  );
};

export default Navbar;

import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { navLinks } from "../assets/constants"; 
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="text-primarytext bg-secondary shadow-md px-[2%] md:px-[10%] py-4">
      <div className="flex items-center justify-between">
        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <RxHamburgerMenu className="text-2xl" />
          </button>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center text-primarytext space-x-20 text-lg font-medium">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group pb-1 border-b-2 ${
                    isActive
                      ? "border-secondary text-secondary"
                      : "border-transparent"
                  }`
                }
              >
                <span className="inline-block transition-transform duration-150 group-hover:scale-110">
                  {label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Theme toggle */}
        <div
          className="relative w-28 h-8 bg-secondary bg-opacity-20 rounded-full flex items-center justify-between cursor-pointer border border-secondary transition"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <span
            className={`absolute top-1 left-1 w-10 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
              theme === "dark" ? "translate-x-16" : "translate-x-0"
            }`}
          />
          <FaSun
            className={`absolute left-2 text-xl transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400" : "text-yellow-400"
            }`}
          />
          <FaMoon
            className={`absolute right-2 text-xl transition-colors duration-300 ${
              theme === "dark" ? "text-blue-400" : "text-gray-400"
            }`}
          />
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden py-5 flex flex-col text-[#E0E0E0] mt-4 space-y-3 text-center text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `hover:text-secondary border-b-2 ${
                  isActive ? "border-secondary" : "border-transparent"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

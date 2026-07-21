import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/tech-support", label: "Tech Support" },
  { to: "/exam-price", label: "Exam Price" },
  { to: "/survey-price", label: "Survey Price" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-mark">
            e
            <motion.span
              className="navbar__leaf"
              animate={{ rotate: [0, -8, 0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              🌿
            </motion.span>
          </span>
          <span className="navbar__logo-text">XAM</span>
        </Link>

        <nav className="navbar__links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                "navbar__link" + (isActive ? " navbar__link--active" : "")
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span layoutId="nav-underline" className="navbar__underline" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link to="/register">
          <motion.span
            className="navbar__register"
            whileHover={{ y: -2, boxShadow: "0 10px 22px rgba(63,145,66,0.3)" }}
            whileTap={{ scale: 0.96 }}
          >
            Register
          </motion.span>
        </Link>
      </div>
    </header>
  );
}

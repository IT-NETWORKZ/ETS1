import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change / resize back to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 680) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
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

        <Link to="/register" className="navbar__register-wrap">
          <motion.span
            className="navbar__register"
            whileHover={{ y: -2, boxShadow: "0 10px 22px rgba(63,145,66,0.3)" }}
            whileTap={{ scale: 0.96 }}
          >
            Register
          </motion.span>
        </Link>

        {/* Hamburger — only visible on mobile via CSS */}
        <button
          type="button"
          className={`navbar__toggle ${menuOpen ? "navbar__toggle--open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="navbar__mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  "navbar__mobile-link" + (isActive ? " navbar__mobile-link--active" : "")
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <span className="navbar__register navbar__register--mobile">Register</span>
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
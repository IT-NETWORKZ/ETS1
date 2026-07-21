import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBars3, HiOutlineXMark, HiOutlineArrowRightOnRectangle, HiOutlineBell } from "react-icons/hi2";
import "./DashboardLayout.css";

export default function DashboardLayout({ role, roleLabel, roleColor, navItems, userName, userMeta, children }) {
   // Mobile sidebar
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dropdown menu
  const [openMenu, setOpenMenu] = useState(null);

  // Screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="dash">
      <aside className={"dash__sidebar" + (mobileOpen ? " dash__sidebar--open" : "")}>
        <div className="dash__brand">
          <Link to="/" className="dash__brand-link">
            <span className="dash__brand-e">e</span>XAM
          </Link>
          <button className="dash__closebtn" onClick={() => setMobileOpen(false)}>
            <HiOutlineXMark />
          </button>
        </div>

        <div className="dash__roletag" style={{ "--role-color": roleColor }}>
          {roleLabel}
        </div>

       <nav className="dash__nav">
  {navItems.map((item, index) => {
    if (item.children) {
      return (
        <div
          key={index}
          className="dash__navgroup"
          onMouseEnter={() => !isMobile && setOpenMenu(index)}
          onMouseLeave={() => !isMobile && setOpenMenu(null)}
        >
          <button
            className="dash__navitem dash__navbutton"
            onClick={() =>
              isMobile &&
              setOpenMenu(openMenu === index ? null : index)
            }
          >
            <item.icon />
            <span>{item.label}</span>

            <span className={"dash__arrow " + (openMenu === index ? "open" : "")}>
              ▼
            </span>
          </button>

          <div
            className={
              "dash__submenu " +
              (openMenu === index ? "dash__submenu--open" : "")
            }
          >
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  "dash__subitem" +
                  (isActive ? " dash__navitem--active" : "")
                }
                onClick={() => setMobileOpen(false)}
              >
                <child.icon />
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          "dash__navitem" + (isActive ? " dash__navitem--active" : "")
        }
        style={{ "--role-color": roleColor }}
        onClick={() => setMobileOpen(false)}
      >
        <item.icon />
        <span>{item.label}</span>
      </NavLink>
    );
  })}
</nav>

        <Link to="/" className="dash__logout">
          <HiOutlineArrowRightOnRectangle /> Back to Site
        </Link>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="dash__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="dash__main">
        <header className="dash__topbar">
          <button className="dash__menubtn" onClick={() => setMobileOpen(true)}>
            <HiOutlineBars3 />
          </button>
          <div className="dash__topbar-spacer" />
          <button className="dash__bell" aria-label="Notifications">
            <HiOutlineBell />
            <span className="dash__bell-dot" />
          </button>
          <div className="dash__user">
            <div className="dash__avatar" style={{ "--role-color": roleColor }}>
              {userName?.[0] || "U"}
            </div>
            <div className="dash__user-text">
              <div className="dash__user-name">{userName}</div>
              <div className="dash__user-meta">{userMeta}</div>
            </div>
          </div>
        </header>

        <div className="dash__content">{children}</div>
      </div>
    </div>
  );
}

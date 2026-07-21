import { motion } from "framer-motion";
import "./StatusToggle.css";

export default function StatusToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className={"stoggle" + (enabled ? " stoggle--on" : "")}
      onClick={onToggle}
      aria-pressed={enabled}
    >
      <span className="stoggle__track">
        <motion.span className="stoggle__thumb" layout transition={{ type: "spring", stiffness: 500, damping: 32 }} />
      </span>
      <span className="stoggle__text">{enabled ? "Enabled" : "Disabled"}</span>
    </button>
  );
}

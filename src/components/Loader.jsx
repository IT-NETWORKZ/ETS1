import { motion } from "framer-motion";
import "./Loader.css";

export default function Loader() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="loader__blob loader__blob--1" />
      <div className="loader__blob loader__blob--2" />

      <motion.div
        className="loader__mark"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="loader__e">e</span>
        <motion.span
          className="loader__leaf"
          animate={{ rotate: [0, -10, 0, 8, 0], y: [0, -3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          🌿
        </motion.span>
        <span className="loader__text">XAM</span>
      </motion.div>

      <motion.div
        className="loader__bar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <motion.div
          className="loader__bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.3, ease: "easeInOut", delay: 0.3 }}
        />
      </motion.div>

      <motion.p
        className="loader__caption"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        Preparing your assessment platform…
      </motion.p>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import "./PageHero.css";

export default function PageHero({ title }) {
  return (
    <div className="pagehero">
      <motion.div
        className="pagehero__blob pagehero__blob--1"
        animate={{ x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pagehero__blob pagehero__blob--2"
        animate={{ x: [0, -20, 0], y: [0, -14, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="container">
        <motion.h1
          className="pagehero__title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
      </div>
    </div>
  );
}

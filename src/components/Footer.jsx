import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <motion.div
        className="container footer__inner"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
      
        <p>
          © Copyright {new Date().getFullYear()}. All Rights Reserved with{" "}
          <span className="footer__brand">Kavin India Pvt Ltd</span>
        </p>
      </motion.div>
    </footer>
  );
}

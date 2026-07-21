import { motion } from "framer-motion";
import CountUp from "./CountUp";
import "./StatCard.css";

export default function StatCard({ icon: Icon, label, value, sub, accent, delay = 0 }) {
  return (
    <motion.div
      className="statcard"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
    >
      <div className="statcard__icon" style={{ "--accent": accent }}>
        <Icon />
      </div>
      <div className="statcard__value">
        <CountUp value={value} delay={delay} />
      </div>
      <div className="statcard__label">{label}</div>
      {sub && <div className="statcard__sub">{sub}</div>}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import "./OpsKanban.css";

const TONE_COLOR = {
  info: "var(--teal-400)",
  danger: "#d9534f",
  success: "var(--leaf-500)",
  neutral: "var(--ink-400)",
};

export default function OpsKanban({ items }) {
  return (
    <div className="opskanban">
      {items.map((item, i) => (
        <motion.div
          key={item.status}
          className="opskanban__col"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          style={{ "--col-color": TONE_COLOR[item.tone] }}
        >
          <div className="opskanban__head">
            <span className="opskanban__dot">
              {item.tone === "danger" && <span className="opskanban__livering" />}
            </span>
            {item.status}
          </div>
          <motion.div
            className="opskanban__count"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 + 0.15, type: "spring", stiffness: 220, damping: 16 }}
          >
            {item.count}
          </motion.div>
          <div className="opskanban__bar" />
        </motion.div>
      ))}
    </div>
  );
}

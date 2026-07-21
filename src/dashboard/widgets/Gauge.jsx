import { motion } from "framer-motion";
import "./Gauge.css";

export default function Gauge({ value = 0, size = 92, stroke = 9, color = "var(--leaf-500)", label, sub, delay = 0 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <motion.div
      className="gauge"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="gauge__svg">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--mist-200)" strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * pct) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: delay + 0.1, ease: "easeOut" }}
        />
      </svg>
      <div className="gauge__center" style={{ width: size, height: size }}>
        <span className="gauge__value">{Math.round(pct)}%</span>
      </div>
      {(label || sub) && (
        <div className="gauge__caption">
          {label && <div className="gauge__label">{label}</div>}
          {sub && <div className="gauge__sub">{sub}</div>}
        </div>
      )}
    </motion.div>
  );
}

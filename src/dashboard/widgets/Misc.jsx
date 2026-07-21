import { motion } from "framer-motion";
import "./Misc.css";

export function ProgressBar({ label, used, total, unit = "", color }) {
  const pct = total ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div className="progressbar">
      <div className="progressbar__head">
        <span>{label}</span>
        <span className="progressbar__count">{used.toLocaleString()} / {total.toLocaleString()} {unit}</span>
      </div>
      <div className="progressbar__track">
        <motion.div
          className="progressbar__fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const BADGE_TONES = {
  success: { bg: "#eef8ef", fg: "var(--leaf-500)" },
  warning: { bg: "#fff4dd", fg: "#a56b00" },
  danger: { bg: "#fdecec", fg: "#c0392b" },
  info: { bg: "#e9f4fd", fg: "#2f7dd1" },
  neutral: { bg: "var(--mist-200)", fg: "var(--ink-600)" },
};

export function Badge({ tone = "neutral", children }) {
  const t = BADGE_TONES[tone] || BADGE_TONES.neutral;
  return (
    <span className="badge" style={{ background: t.bg, color: t.fg }}>
      {children}
    </span>
  );
}

export function EmptyState({ icon: Icon, text }) {
  return (
    <div className="emptystate">
      {Icon && <Icon />}
      <p>{text}</p>
    </div>
  );
}

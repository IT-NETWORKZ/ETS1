import { motion } from "framer-motion";
import "./FeedbackStatusPicker.css";

const STATUS_TONES = {
  New: { bg: "#e9f4fd", fg: "#2f7dd1" },
  Approved: { bg: "#fff4dd", fg: "#07f261" },
  Rejected: { bg: "#eef8ef", fg: "#ef0d0d" },
};

const STATUSES = ["New", "Approved", "Rejected"];

export default function FeedbackStatusPicker({ value, onChange }) {
  const tone = STATUS_TONES[value] || STATUS_TONES.New;
  return (
    <motion.select
      className="fstatus"
      style={{ background: tone.bg, color: tone.fg }}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      whileTap={{ scale: 0.96 }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </motion.select>
  );
}

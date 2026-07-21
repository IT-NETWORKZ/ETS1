import { motion } from "framer-motion";
import {
  HiOutlineUserCircle, HiOutlineSparkles, HiOutlineShieldCheck,
  HiOutlineClipboardDocumentCheck, HiOutlineAcademicCap,
} from "react-icons/hi2";
import "./JourneyRail.css";

const STEPS = [
  { key: "register", label: "Registered", icon: HiOutlineUserCircle },
  { key: "practice", label: "Practice", icon: HiOutlineSparkles },
  { key: "exam", label: "Live Exam", icon: HiOutlineShieldCheck },
  { key: "result", label: "Result", icon: HiOutlineClipboardDocumentCheck },
  { key: "certificate", label: "Certificate", icon: HiOutlineAcademicCap },
];

export default function JourneyRail({ activeKey = "exam" }) {
  const activeIndex = STEPS.findIndex((s) => s.key === activeKey);

  return (
    <div className="jrail">
      <div className="jrail__track">
        <motion.div
          className="jrail__fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: activeIndex / (STEPS.length - 1) }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <div className="jrail__steps">
        {STEPS.map((step, i) => {
          const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming";
          return (
            <motion.div
              key={step.key}
              className={`jrail__step jrail__step--${state}`}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.09 }}
            >
              <span className="jrail__dot">
                {state === "active" && <span className="jrail__pulse" />}
                <step.icon />
              </span>
              <span className="jrail__label">{step.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

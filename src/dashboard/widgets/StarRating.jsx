import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiStar } from "react-icons/hi2";
import "./StarRating.css";

const LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
const LABEL_COLORS = ["#c0392b", "#e0863a", "#f5a623", "#58b25b", "#3f9142"];

export default function StarRating({ value = 0, onChange, size = 34 }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="starrating">
      <div className="starrating__stars" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= active;
          return (
            <motion.button
              key={n}
              type="button"
              className="starrating__star"
              style={{ "--star-size": `${size}px` }}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onClick={() => onChange?.(n)}
              whileTap={{ scale: 0.8, rotate: -8 }}
              animate={
                filled
                  ? { scale: [1, 1.28, 1], rotate: [0, -10, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <HiStar
                className={"starrating__icon" + (filled ? " starrating__icon--filled" : "")}
              />
              {filled && (
                <motion.span
                  className="starrating__glow"
                  initial={{ opacity: 0.6, scale: 0.4 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="starrating__labelwrap">
        <AnimatePresence mode="wait">
          {active > 0 && (
            <motion.span
              key={active}
              className="starrating__label"
              style={{ color: LABEL_COLORS[active - 1] }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {LABELS[active - 1]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

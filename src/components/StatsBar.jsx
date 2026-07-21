import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { HiOutlineUserGroup, HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import "./StatsBar.css";

const STATS = [
  { icon: HiOutlineUserGroup, value: 5594, label: "Candidates" },
  { icon: HiOutlineBriefcase, value: 295, label: "Admins" },
  { icon: HiOutlineDocumentText, value: 2902, label: "Subjects" },
  { icon: HiOutlineQuestionMarkCircle, value: 250726, label: "MCQs" },
];

function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export default function StatsBar() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        {STATS.map((s, i) => (
          <motion.div
            className="stats__item"
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
          >
            <div className="stats__icon">
              <s.icon />
            </div>
            <div className="stats__value">
              <Counter value={s.value} />
            </div>
            <div className="stats__label">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

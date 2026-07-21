import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import "./HighlightBand.css";

const ANNOUNCEMENTS = [
  "New: Ready-made question banks now available for 40+ subjects.",
  "Happy Learning — extended free access for institutions this season.",
  "Master & Expert plans now include priority tech support.",
];

const PERIODS = [
  {
    id: "week",
    label: "Week",
    male: { name: "Aditya Kulkarni", meta: "Top scorer · Logical Reasoning", seed: "Aditya" },
    female: { name: "Sneha Deshmukh", meta: "Top scorer · Verbal Ability", seed: "Sneha" },
  },
  {
    id: "month",
    label: "Month",
    male: { name: "Rohit Sharma", meta: "Top scorer · Data Structures", seed: "Rohit" },
    female: { name: "Amrapali Ambade", meta: "Top scorer · Aptitude", seed: "Amrapali" },
  },
  {
    id: "year",
    label: "Year",
    male: { name: "Karan Mehta", meta: "Top scorer · Overall Ranking", seed: "Karan" },
    female: { name: "Priya Nair", meta: "Top scorer · Overall Ranking", seed: "Priya" },
  },
];

function CandidateCard({ title, person, delay }) {
  return (
    <motion.div
      className="highlight__card"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="highlight__title">{title}</span>
      <AnimatePresence mode="wait">
        <motion.div
          className="highlight__person"
          key={person.seed}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div className="highlight__avatar" whileHover={{ scale: 1.05 }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.seed}`}
              alt={`${title} candidate`}
            />
          </motion.div>
          <div>
            <div className="highlight__name">{person.name}</div>
            <div className="highlight__meta">{person.meta}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function HighlightBand() {
  const [annIndex, setAnnIndex] = useState(0);
  const [periodIndex, setPeriodIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnnIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setPeriodIndex((i) => (i + 1) % PERIODS.length), 4500);
    return () => clearInterval(id);
  }, []);

  const period = PERIODS[periodIndex];

  return (
    <section className="highlight">
      <div className="container highlight__head">
        <span className="highlight__eyebrow">Candidate of The</span>
        <div className="highlight__tabs">
          {PERIODS.map((p, i) => (
            <button
              key={p.id}
              className={"highlight__tab" + (i === periodIndex ? " highlight__tab--active" : "")}
              onClick={() => setPeriodIndex(i)}
            >
              {p.label}
              {i === periodIndex && (
                <motion.span layoutId="period-underline" className="highlight__tab-underline" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container highlight__grid">
        <CandidateCard title={`${period.label} — Male`} person={period.male} delay={0} />
        <CandidateCard title={`${period.label} — Female`} person={period.female} delay={0.1} />

        <motion.div
          className="highlight__ticker"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={annIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
            >
              {ANNOUNCEMENTS[annIndex]}
            </motion.p>
          </AnimatePresence>
          <div className="highlight__dots">
            {ANNOUNCEMENTS.map((_, i) => (
              <button
                key={i}
                className={"highlight__dot" + (i === annIndex ? " highlight__dot--active" : "")}
                onClick={() => setAnnIndex(i)}
                aria-label={`Show announcement ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

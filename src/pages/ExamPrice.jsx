import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import StatsBar from "../components/StatsBar";
import HighlightBand from "../components/HighlightBand";
import "./ExamPrice.css";

const PLANS = [
  { tag: "INTERN", price: "1,100", exams: "100 Exams", validity: "1 Month Validity" },
  { tag: "PROFESSIONAL", price: "6,000", exams: "1000 Exams", validity: "18 Months Validity", popular: true },
  { tag: "MASTER", price: "25,000", exams: "5000 Exams", validity: "24 Months Validity" },
  { tag: "EXPERT", price: "100,000", exams: "25000 Exams", validity: "30 Months Validity" },
  { tag: "CHIEF", price: "125,000", exams: "50000 Exams", validity: "36 Months Validity" },
];

const FEATURES = ["Question bank upload facility", "Ready made question banks available", "Terms & conditions apply"];

export default function ExamPrice() {
  return (
    <div>
      <PageHero title="Exam Price" />
      <section className="examprice">
        <div className="container examprice__grid">
          {PLANS.map((p, i) => (
            <motion.div
              className={"pricecard" + (p.popular ? " pricecard--popular" : "")}
              key={p.tag}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -8 }}
            >
              {p.popular && <span className="pricecard__badge">Most Popular</span>}
              <div className="pricecard__tag">{p.tag}</div>
              <div className="pricecard__price">
                <span className="pricecard__currency">₹</span>{p.price}
              </div>
              <ul className="pricecard__list">
                <li>{p.exams}</li>
                <li>{p.validity}</li>
                {FEATURES.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <motion.button
                className="pricecard__cta"
                whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(63,145,66,0.35)" }}
                whileTap={{ scale: 0.96 }}
              >
                Pay Now
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      <StatsBar />
      <HighlightBand />
    </div>
  );
}

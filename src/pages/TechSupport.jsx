import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePhone, HiOutlineMapPin, HiOutlineEnvelope, HiOutlinePlus, HiOutlineMinus } from "react-icons/hi2";
import PageHero from "../components/PageHero";
import StatsBar from "../components/StatsBar";
import HighlightBand from "../components/HighlightBand";
import "./TechSupport.css";

const PLANS = [
  { name: "Intern", detail: "₹1,100 · 100 exams · 1 month validity" },
  { name: "Professional", detail: "₹6,000 · 1000 exams · 18 months validity" },
  { name: "Master", detail: "₹25,000 · 5000 exams · 24 months validity" },
  { name: "Expert", detail: "₹100,000 · 25000 exams · 30 months validity" },
  { name: "Chief", detail: "₹125,000 · 50000 exams · 36 months validity" },
];

export default function TechSupport() {
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ first: "", last: "", phone: "", email: "", need: "", message: "" });
  const [sent, setSent] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3200);
  }

  return (
    <div>
      <PageHero title="Tech Support" />

      <section className="techsupport">
        <div className="container techsupport__grid">
          <motion.form
            className="tscard"
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="tscard__title">Tech Support</h3>
            <div className="tscard__row">
              <div className="tscard__field">
                <label>First Name *</label>
                <input required value={form.first} onChange={(e) => update("first", e.target.value)} placeholder="Enter First Name" />
              </div>
              <div className="tscard__field">
                <label>Last Name *</label>
                <input required value={form.last} onChange={(e) => update("last", e.target.value)} placeholder="Enter Last Name" />
              </div>
            </div>
            <div className="tscard__row">
              <div className="tscard__field">
                <label>Contact Number *</label>
                <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Enter Phone Number" />
              </div>
              <div className="tscard__field">
                <label>Email Id *</label>
                <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Enter Email Id" />
              </div>
            </div>
            <div className="tscard__field">
              <label>Please specify your need *</label>
              <select required value={form.need} onChange={(e) => update("need", e.target.value)}>
                <option value="">Select Your Need</option>
                <option>Login issue</option>
                <option>Payment / subscription</option>
                <option>Question bank upload</option>
                <option>Exam scheduling</option>
                <option>Other</option>
              </select>
            </div>
            <div className="tscard__field">
              <label>Message *</label>
              <textarea required rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Add number own or write" />
            </div>

            <motion.button
              type="submit"
              className="tscard__submit"
              whileHover={{ y: -2, boxShadow: "0 12px 26px rgba(63,145,66,0.35)" }}
              whileTap={{ scale: 0.97 }}
            >
              Send Message
            </motion.button>

            <AnimatePresence>
              {sent && (
                <motion.div
                  className="tscard__toast"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  Message sent — our team will reach out shortly.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          <motion.div
            className="tscard tscard--pricing"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="tscard__title">Pricing</h3>
            <p className="tscard__subtitle">Exam Pricing List</p>
            <div className="accordion">
              {PLANS.map((p, i) => (
                <div className="accordion__item" key={p.name}>
                  <button className="accordion__head" onClick={() => setOpen(open === i ? null : i)}>
                    {p.name}
                    {open === i ? <HiOutlineMinus /> : <HiOutlinePlus />}
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        className="accordion__body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{p.detail}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="tscard office"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h4 className="office__title">India Operations</h4>
            <p className="office__name">IT-NetworkZ Infosystems Pvt. Ltd.</p>
            <p className="office__line"><HiOutlineMapPin /> 102/201 Akanksha Building, RPTS Rd, Laxmi Nagar, Nagpur – 22, India</p>
            <p className="office__line"><HiOutlinePhone /> +91 9665999900</p>
            <p className="office__line"><HiOutlinePhone /> +91 7276064645</p>
            <p className="office__line"><HiOutlineEnvelope /> contact@ex-am.com</p>
          </motion.div>

          <motion.div
            className="tscard office"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="office__title">International Operations</h4>
            <p className="office__name">Kavin SA Pty. Ltd.</p>
            <p className="office__line"><HiOutlineMapPin /> 21 - Bonaire Complex, Denise Street, Johannesburg – 2196, South Africa</p>
            <p className="office__line"><HiOutlinePhone /> +27 11-2346183</p>
            <p className="office__line"><HiOutlinePhone /> 0846933267</p>
            <p className="office__line"><HiOutlineEnvelope /> contact@kavin.co.za</p>
          </motion.div>
        </div>
      </section>

      <StatsBar />
      <HighlightBand />
    </div>
  );
}

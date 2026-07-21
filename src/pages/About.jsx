import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import StatsBar from "../components/StatsBar";
import HighlightBand from "../components/HighlightBand";
import "./About.css";

const PARAGRAPHS = [
  "EXAM is an online exam facility service for Primary, Secondary, Higher Secondary, UG, PG, Research Scholars, Working Professionals and Govt Job Seekers to make best exam practices, assess IQ, and increase subject knowledge. It's built for IT organisations, examining labs, research institutions, schools, colleges, private coaching institutions, and individuals — from primary students to working professionals.",
  "The sole purpose is to provide an excellent platform for online assessment of academic subjects and professional skills, for institutions and individuals alike.",
  "An Admin user is an organisation or institution that wants to run online exams (assessments) for employees, seekers, or students. They can select the number of exams as per requirement — it's a paid subscription. Exams can be scheduled for any number of participants at a chosen day and time, with participant details added via form or registration IDs. Exam info is sent directly to participants' mail. History, participant details, and certificates are all available on the admin dashboard.",
  "A Candidate is an individual who wants to increase speed with the new era of online assessment and gain more knowledge in targeted subjects. Candidates get access as per their practice-exam requirements — also a paid option, unless added directly by an admin. Practice records and exam history are available in the candidate dashboard under History/Result.",
  "Both a ready-made question bank and the option to upload your own are available for admins and candidates as needed. Subscriptions renew multiple times across Beginner, Master, or Expert tiers.",
];

export default function About() {
  return (
    <div>
      <PageHero title="About" />
      <section className="about">
        <div className="container about__grid">
          <motion.aside
            className="about__clients"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="about__clients-tab">Our Clients</div>
            <div className="about__clients-body">
              <p>Trusted by schools, colleges, coaching institutes, and enterprises across India and South Africa.</p>
              <ul className="about__client-list">
                <li>IT-NetworkZ Infosystems Pvt. Ltd.</li>
                <li>Kavin SA Pty. Ltd.</li>
                <li>Nagpur Institute of Technology</li>
                <li>Prime Coaching Centre</li>
              </ul>
            </div>
          </motion.aside>

          <motion.div
            className="about__content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="about__heading">About EXAM</h2>
            {PARAGRAPHS.map((p, i) => (
              <motion.p
                key={i}
                className="about__para"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                {p}
              </motion.p>
            ))}
            <div className="about__callout">
              Happy Learning: services for organisations and candidates carry extended free access this season — take max benefit while it lasts.
            </div>
          </motion.div>
        </div>
      </section>

      <StatsBar />
      <HighlightBand />
    </div>
  );
}

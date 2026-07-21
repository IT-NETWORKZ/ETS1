import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Link } from "react-router-dom";
import "./TopBar.css";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <div className="topbar__contacts">
          <a href="mailto:support@ex-am.com" className="topbar__item">
            <HiOutlineMail />
            <span>support@ex-am.com</span>
          </a>
          <span className="topbar__divider" />
          <a href="tel:+919665999900" className="topbar__item">
            <HiOutlinePhone />
            <span>+91 9665999900 (India) / 0027-11-1002598 (South Africa)</span>
          </a>
        </div>

        <Link to="/demo-exam">
          <motion.button
            className="topbar__cta"
            whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(245,166,35,0.45)" }}
            whileTap={{ scale: 0.96 }}
          >
            <HiOutlinePencilSquare />
            Demo Exam
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

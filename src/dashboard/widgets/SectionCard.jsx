import { motion } from "framer-motion";
import "./SectionCard.css";

export default function SectionCard({ title, subtitle, action, children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={"sectioncard " + className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay }}
    >
      {(title || action) && (
        <div className="sectioncard__head">
          <div>
            {title && <h3 className="sectioncard__title">{title}</h3>}
            {subtitle && <p className="sectioncard__subtitle">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="sectioncard__body">{children}</div>
    </motion.div>
  );
}

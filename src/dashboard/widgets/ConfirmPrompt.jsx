import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import "./ConfirmPrompt.css";

export default function ConfirmPrompt({ open, title, message, onYes, onNo, yesLabel = "Yes", noLabel = "No" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cprompt__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onNo}
        >
          <motion.div
            className="cprompt__card"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <HiOutlineQuestionMarkCircle className="cprompt__icon" />
            <h3 className="cprompt__title">{title}</h3>
            {message && <p className="cprompt__message">{message}</p>}
            <div className="cprompt__actions">
              <button type="button" className="cprompt__no" onClick={onNo}>{noLabel}</button>
              <button type="button" className="cprompt__yes" onClick={onYes}>{yesLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

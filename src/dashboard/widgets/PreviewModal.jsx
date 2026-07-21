import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";
import "./MasterTable.css";

export function PreviewButton({ onClick }) {
  return (
    <button type="button" className="mt-pill" onClick={onClick}>
      Preview
    </button>
  );
}

export function PreviewModal({ open, onClose, title, meta, image, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mt-previewoverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mt-previewcard"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="mt-previewcard__close" onClick={onClose} aria-label="Close preview">
              <HiOutlineXMark />
            </button>
            {image && <img className="mt-previewcard__image" src={image} alt={title || "Preview"} />}
            {title && <div className="mt-previewcard__title">{title}</div>}
            {meta && <div className="mt-previewcard__meta">{meta}</div>}
            <div className="mt-previewcard__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

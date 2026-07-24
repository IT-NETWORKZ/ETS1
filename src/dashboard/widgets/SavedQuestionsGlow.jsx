import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import QuestionAnswerView from "./QuestionAnswerView";
import "./SavedQuestionsGlow.css";

/**
 * items: array of saved-but-not-submitted question drafts (chronological order)
 * patterns: optional QUESTION_PATTERNS list, used to resolve icon/label per item
 *   (admin/superadmin pass this; the candidate builder has only one pattern
 *   and can omit it entirely)
 * onEdit(item): load this item back into the form for editing
 * onDelete(item): remove this item from the saved list
 */
export default function SavedQuestionsGlow({ items, patterns, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index > items.length - 1) setIndex(Math.max(0, items.length - 1));
  }, [items.length, index]);

  if (items.length === 0) return null;

  const current = items[index];
  const meta = patterns ? patterns.find((p) => p.id === current?.pattern) : null;

  function goPrev() { setIndex((i) => Math.max(0, i - 1)); }
  function goNext() { setIndex((i) => Math.min(items.length - 1, i + 1)); }

  function handleEdit() {
    setOpen(false);
    onEdit(current);
  }

  function handleDelete() {
    onDelete(current);
  }

  return (
    <>
      <motion.button
        type="button"
        className="sqg__ball"
        onClick={() => { setIndex(items.length - 1); setOpen(true); }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        title={`${items.length} question${items.length === 1 ? "" : "s"} saved this session — click to review`}
      >
        <span className="sqg__ballcount">{items.length}</span>
        <span className="sqg__balllabel">Saved</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="sqg__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="sqg__card"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sqg__head">
                <span className="sqg__headcount">Question {index + 1} of {items.length}</span>
                <button type="button" className="sqg__close" onClick={() => setOpen(false)} aria-label="Close">
                  <HiOutlineXMark />
                </button>
              </div>

              <div className="sqg__meta">
                {current.subject || "No subject"}{current.topic ? ` · ${current.topic}` : ""}
              </div>

              <div className="sqg__body">
                <QuestionAnswerView q={current} patternMeta={meta} />
              </div>

              <div className="sqg__footer">
                <button type="button" className="sqg__navbtn" disabled={index === 0} onClick={goPrev} title="Previous">
                  <HiOutlineArrowLeft /> Previous
                </button>
                <div className="sqg__footeractions">
                  <button type="button" className="sqg__deletebtn" onClick={handleDelete} title="Delete this question">
                    <HiOutlineTrash /> Delete
                  </button>
                  <button type="button" className="sqg__editbtn" onClick={handleEdit} title="Edit this question">
                    <HiOutlinePencil /> Edit
                  </button>
                </div>
                <button type="button" className="sqg__navbtn" disabled={index === items.length - 1} onClick={goNext} title="Next">
                  Next <HiOutlineArrowRight />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

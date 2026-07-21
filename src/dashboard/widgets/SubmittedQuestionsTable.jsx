import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineXMark, HiOutlineArrowLeft, HiOutlineArrowRight,
  HiOutlinePencil, HiOutlineTrash,
} from "react-icons/hi2";
import MasterTable from "./MasterTable";
import StatusToggle from "./StatusToggle";
import { PreviewButton } from "./PreviewModal";
import QuestionAnswerView from "./QuestionAnswerView";
import { QUESTION_PATTERNS } from "../../pages/dashboard/admin/questions/questionPatterns";
import "./SavedQuestionsGlow.css";

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * records: submitted question records (id, pattern, subject, questionText, createdAt, status, ...)
 * onToggleStatus(id, nextStatus)
 * onEdit(record) — load this record back into the form above for editing
 * onDelete(id) — remove just this one record
 * extraColumns: optional MasterTable column defs inserted between Subject and Date (e.g. Tenant)
 */
export default function SubmittedQuestionsTable({ records, onToggleStatus, onEdit, onDelete, extraColumns = [] }) {
  const [previewId, setPreviewId] = useState(null);
  const index = records.findIndex((r) => r.id === previewId);
  const current = index >= 0 ? records[index] : null;
  const meta = current ? QUESTION_PATTERNS.find((p) => p.id === current.pattern) : null;

  const rows = records.map((r, i) => ({ ...r, srNo: i + 1 }));

  const columns = [
    { key: "srNo", label: "Sr. No.", sortable: true },
    { key: "subject", label: "Subject", sortable: true, render: (r) => r.subject || "No subject" },
    ...extraColumns,
    { key: "createdAt", label: "Date", sortable: true, render: (r) => formatDate(r.createdAt) },
    { key: "preview", label: "Preview", render: (r) => <PreviewButton onClick={() => setPreviewId(r.id)} /> },
    {
      key: "status", label: "Status",
      render: (r) => (
        <StatusToggle
          enabled={r.status === "enabled"}
          onToggle={() => onToggleStatus(r.id, r.status === "enabled" ? "disabled" : "enabled")}
        />
      ),
    },
  ];

  function goPrev() { if (index > 0) setPreviewId(records[index - 1].id); }
  function goNext() { if (index < records.length - 1) setPreviewId(records[index + 1].id); }

  function handleEdit() {
    setPreviewId(null);
    onEdit(current);
  }

  function handleDelete() {
    onDelete(current.id);
  }

  return (
    <>
      <MasterTable
        columns={columns}
        rows={rows}
        searchKeys={["subject", "topic", "questionText"]}
        keyField="id"
      />

      <AnimatePresence>
        {current && (
          <motion.div
            className="sqg__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewId(null)}
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
                <span className="sqg__headcount">Question {index + 1} of {records.length}</span>
                <button type="button" className="sqg__close" onClick={() => setPreviewId(null)} aria-label="Close">
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
                <button type="button" className="sqg__navbtn" disabled={index === records.length - 1} onClick={goNext} title="Next">
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

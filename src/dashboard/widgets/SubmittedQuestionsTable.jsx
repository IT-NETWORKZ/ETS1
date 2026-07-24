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
 * records: submitted question records — either a "batch" record shaped like
 *   { id, createdAt, status, questions: [...] } produced by Submit All, or a
 *   flat single-question legacy record. Each record is exactly ONE row in
 *   the table; if it holds multiple questions, Preview lets you browse them
 *   without ever mixing in questions from a different submission.
 * onToggleStatus(id, nextStatus)
 * onEdit(record) — load a question back into the form above for editing
 * onDelete(id) — remove a whole flat record (legacy, non-batch)
 * onDeleteQuestion(batchId, index) — remove a single question from a batch
 * extraColumns: optional MasterTable column defs inserted between Subject and Date (e.g. Tenant)
 */
export default function SubmittedQuestionsTable({ records, onToggleStatus, onEdit, onDelete, onDeleteQuestion, extraColumns = [] }) {
  const [previewId, setPreviewId] = useState(null);
  const [qIndex, setQIndex] = useState(0);

  const previewRecord = records.find((r) => r.id === previewId) || null;
  const isBatch = previewRecord ? Array.isArray(previewRecord.questions) : false;
  const previewQuestions = previewRecord ? (isBatch ? previewRecord.questions : [previewRecord]) : [];
  const current = previewQuestions[qIndex] || null;
  const meta = current ? QUESTION_PATTERNS.find((p) => p.id === current.pattern) : null;

  const rows = records.map((r, i) => {
    const qList = Array.isArray(r.questions) ? r.questions : [r];
    const first = qList[0] || {};
    return {
      ...r,
      srNo: i + 1,
      subject: r.subject || first.subject,
      topic: r.topic || first.topic,
      questionText: first.questionText,
      questionCount: qList.length,
    };
  });

  const columns = [
    { key: "srNo", label: "Sr. No.", sortable: true },
    { key: "subject", label: "Subject", sortable: true, render: (r) => r.subject || "No subject" },
    { key: "questionCount", label: "Questions", sortable: true },
    ...extraColumns,
    { key: "createdAt", label: "Date", sortable: true, render: (r) => formatDate(r.createdAt) },
    { key: "preview", label: "Preview", render: (r) => <PreviewButton onClick={() => openPreview(r.id)} /> },
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

  function openPreview(id) {
    setPreviewId(id);
    setQIndex(0);
  }

  function closePreview() {
    setPreviewId(null);
  }

  function goPrev() { setQIndex((i) => Math.max(0, i - 1)); }
  function goNext() { setQIndex((i) => Math.min(previewQuestions.length - 1, i + 1)); }

  function handleEdit() {
    closePreview();
    if (isBatch) {
      onEdit({ ...current, _batchId: previewRecord.id, _batchIndex: qIndex });
    } else {
      onEdit(previewRecord);
    }
  }

  function handleDelete() {
    if (isBatch) {
      onDeleteQuestion?.(previewRecord.id, qIndex);
    } else {
      onDelete(previewRecord.id);
    }
    closePreview();
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
            onClick={closePreview}
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
                <span className="sqg__headcount">Question {qIndex + 1} of {previewQuestions.length}</span>
                <button type="button" className="sqg__close" onClick={closePreview} aria-label="Close">
                  <HiOutlineXMark />
                </button>
              </div>

              <div className="sqg__meta">
                {current.subject || previewRecord.subject || "No subject"}{current.topic ? ` · ${current.topic}` : ""}
              </div>

              <div className="sqg__body">
                <QuestionAnswerView q={current} patternMeta={meta} />
              </div>

              <div className="sqg__footer">
                <button type="button" className="sqg__navbtn" disabled={qIndex === 0} onClick={goPrev} title="Previous">
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
                <button type="button" className="sqg__navbtn" disabled={qIndex === previewQuestions.length - 1} onClick={goNext} title="Next">
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineArrowDownTray, HiOutlineArrowUpTray, HiOutlineDocumentCheck,
  HiOutlineCheckCircle, HiOutlinePaperAirplane,
} from "react-icons/hi2";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import SectionCard from "../../../../dashboard/widgets/SectionCard";
import SavedQuestionsGlow from "../../../../dashboard/widgets/SavedQuestionsGlow";
import SubmittedQuestionsTable from "../../../../dashboard/widgets/SubmittedQuestionsTable";
import ConfirmPrompt from "../../../../dashboard/widgets/ConfirmPrompt";
import { createQuestionBankStore } from "../../../../dashboard/questionBankStore";
import { CANDIDATE_NAV } from "../candidateNav";
import PatternFields from "./PatternFields";
import "../../../../dashboard/DashboardShared.css";
import "./QuestionBank.css";

const questionBankStore = createQuestionBankStore("questionBankRecords_candidate_v1");

const EMPTY_DRAFT = {
  id: null, subject: "", topic: "", difficulty: "Moderate", marks: "1", negMarks: "0", language: "English",
  questionText: "",
  questionMedia: { image: null, audio: null, video: null },
  options: [
    { id: 1, text: "", media: { image: null, audio: null, video: null } },
    { id: 2, text: "", media: { image: null, audio: null, video: null } },
    { id: 3, text: "", media: { image: null, audio: null, video: null } },
    { id: 4, text: "", media: { image: null, audio: null, video: null } },
  ],
  correctOptions: [],
};

export default function QuestionBank() {
  const [excelFile, setExcelFile] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saved, setSaved] = useState([]);
  const [justSaved, setJustSaved] = useState(false);
  const [showAddAnother, setShowAddAnother] = useState(false);
  const submittedRecords = questionBankStore.useList();

  const patch = (p) => setDraft((d) => ({ ...d, ...p }));

  function handleSave(e) {
    e.preventDefault();
    if (!draft.questionText.trim()) return;

    // Editing one question that lives inside an already-submitted batch row —
    // update just that question in place, then ask if they want to add another.
    if (draft._batchId) {
      const { _batchId, _batchIndex, ...clean } = draft;
      questionBankStore.updateQuestionInBatch(_batchId, _batchIndex, clean);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
      setShowAddAnother(true);
      return;
    }

    setSaved((s) => {
      if (draft.id) return s.map((q) => (q.id === draft.id ? { ...q, ...draft } : q));
      return [...s, { ...draft, id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }];
    });
    setDraft(EMPTY_DRAFT);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  }

  function handleEditQuestion(item) {
    setDraft({ ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteDraft(item) {
    setSaved((s) => s.filter((q) => q.id !== item.id));
    if (draft.id === item.id) setDraft(EMPTY_DRAFT);
  }

  function handleSubmitAll() {
    if (saved.length === 0) return;
    const now = Date.now();
    const batch = {
      id: `batch-${now}`,
      createdAt: now,
      status: "enabled",
      questions: saved.map((q) => ({ ...q })),
    };
    questionBankStore.addMany([batch]);
    setSaved([]);
    setDraft(EMPTY_DRAFT);
  }

  function handleAddAnotherYes() {
    setDraft((d) => ({
      ...EMPTY_DRAFT,
      subject: d.subject, topic: d.topic, difficulty: d.difficulty, marks: d.marks, negMarks: d.negMarks, language: d.language,
    }));
    setShowAddAnother(false);
  }

  function handleAddAnotherNo() {
    setDraft(EMPTY_DRAFT);
    setShowAddAnother(false);
  }

  return (
    <DashboardLayout
      role="candidate" roleLabel="candidate" roleColor="#3f9142"
      navItems={CANDIDATE_NAV} userName="Amrapali Ambade" userMeta="candidate"
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="dashpage__heading">Question Bank</h1>
        <p className="dashpage__subheading">Upload questions in bulk via Excel, or write them one at a time below.</p>
      </motion.div>

      {/* ---- Bulk upload via Excel ---- */}
      <SectionCard title="Bulk Upload via Excel" subtitle="Fastest way to add a large question set" delay={0.05}>
        <div className="qexcel">
          <a href="#" className="qexcel__sample" onClick={(e) => e.preventDefault()}>
            <HiOutlineArrowDownTray /> Download Sample Excel
          </a>
          <label className="qexcel__drop">
            <HiOutlineArrowUpTray />
            <span>{excelFile ? excelFile.name : "Click to choose a .xls / .xlsx file, or drag it here"}</span>
            <input
              type="file" accept=".xls,.xlsx" hidden
              onChange={(e) => setExcelFile(e.target.files[0] || null)}
            />
          </label>
          <button type="button" className="qexcel__submit" disabled={!excelFile}>
            <HiOutlineDocumentCheck /> Upload &amp; Validate
          </button>
        </div>
      </SectionCard>

      {/* ---- Manually-written question builder ---- */}
      <SectionCard title="Write a Question Manually" subtitle="Fill in the fields below" delay={0.12}>
        <form className="qform" onSubmit={handleSave}>
          <div className="qform__common">
            <label className="qfield">
              <span className="qfield__label">Subject</span>
              <input type="text" placeholder="e.g. Quantitative Aptitude" value={draft.subject} onChange={(e) => patch({ subject: e.target.value })} />
            </label>
            <label className="qfield">
              <span className="qfield__label">Topic</span>
              <input type="text" placeholder="e.g. Time & Work" value={draft.topic} onChange={(e) => patch({ topic: e.target.value })} />
            </label>
            <label className="qfield">
              <span className="qfield__label">Difficulty</span>
              <select value={draft.difficulty} onChange={(e) => patch({ difficulty: e.target.value })}>
                <option>Basic</option><option>Moderate</option><option>Hard</option><option>Advanced</option>
              </select>
            </label>
            <label className="qfield">
              <span className="qfield__label">Marks</span>
              <input type="number" min="0" step="0.5" value={draft.marks} onChange={(e) => patch({ marks: e.target.value })} />
            </label>
            <label className="qfield">
              <span className="qfield__label">Negative Marks</span>
              <input type="number" min="0" step="0.25" value={draft.negMarks} onChange={(e) => patch({ negMarks: e.target.value })} />
            </label>
            <label className="qfield">
              <span className="qfield__label">Language</span>
              <select value={draft.language} onChange={(e) => patch({ language: e.target.value })}>
                <option>English</option><option>Hindi</option><option>Marathi</option>
              </select>
            </label>
          </div>

          <PatternFields draft={draft} setDraft={setDraft} />

          <div className="qform__footer">
            <button type="submit" className="qform__save">{draft.id ? "Update Question" : "Save Question"}</button>
            {draft.id && (
              <button type="button" className="qform__cancel" onClick={() => setDraft(EMPTY_DRAFT)}>Cancel edit</button>
            )}
            <AnimatePresence>
              {justSaved && (
                <motion.span
                  className="qform__savedtag"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                >
                  <HiOutlineCheckCircle /> {draft.id ? "Updated" : "Added to question bank"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>
      </SectionCard>

      {/* ---- Submit everything saved this session into the question bank table ---- */}
      <SectionCard title="Submit Questions" subtitle="Push every question saved this session into the question bank below" delay={0.18}>
        <div className="qsubmitbar">
          <span className="qsubmitbar__count">
            {saved.length === 0 ? "No questions saved yet — save at least one above." : `${saved.length} question${saved.length === 1 ? "" : "s"} ready to submit`}
          </span>
          <button type="button" className="qsubmitbar__btn" disabled={saved.length === 0} onClick={handleSubmitAll}>
            <HiOutlinePaperAirplane /> Submit {saved.length > 0 ? `(${saved.length})` : ""}
          </button>
        </div>
      </SectionCard>

      {/* ---- Submitted question bank ---- */}
      <SectionCard title={`Question Bank (${submittedRecords.length})`} subtitle="Search, page through, preview or enable/disable any question" delay={0.24}>
        <SubmittedQuestionsTable
          records={submittedRecords}
          onToggleStatus={questionBankStore.setStatus}
          onEdit={handleEditQuestion}
          onDelete={questionBankStore.remove}
          onDeleteQuestion={questionBankStore.removeQuestionFromBatch}
        />
      </SectionCard>

      <SavedQuestionsGlow items={saved} onEdit={handleEditQuestion} onDelete={handleDeleteDraft} />

      <ConfirmPrompt
        open={showAddAnother}
        title="Add another question?"
        message="Do you want to create another question for this subject now?"
        yesLabel="Yes, add another"
        noLabel="No, I'm done"
        onYes={handleAddAnotherYes}
        onNo={handleAddAnotherNo}
      />
    </DashboardLayout>
  );
}
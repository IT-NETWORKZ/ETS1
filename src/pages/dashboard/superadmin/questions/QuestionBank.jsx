import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineArrowDownTray, HiOutlineArrowUpTray, HiOutlineDocumentCheck,
  HiOutlineCheckCircle, HiOutlineGlobeAlt, HiOutlinePaperAirplane,
} from "react-icons/hi2";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import SectionCard from "../../../../dashboard/widgets/SectionCard";
import SavedQuestionsGlow from "../../../../dashboard/widgets/SavedQuestionsGlow";
import SubmittedQuestionsTable from "../../../../dashboard/widgets/SubmittedQuestionsTable";
import ConfirmPrompt from "../../../../dashboard/widgets/ConfirmPrompt";
import { createQuestionBankStore } from "../../../../dashboard/questionBankStore";
import { Badge } from "../../../../dashboard/widgets/Misc";
import { SUPERADMIN_NAV } from "../superadminNav";
import { QUESTION_PATTERNS } from "../../admin/questions/questionPatterns";
import PatternFields from "../../admin/questions/PatternFields";
import "../../../../dashboard/DashboardShared.css";
import "../../admin/questions/QuestionBank.css";
import "./SuperadminQuestionBank.css";

const questionBankStore = createQuestionBankStore("questionBankRecords_superadmin_v1");

const TENANTS = [
  "All Tenants (Global Pool)", "TechPrep Institute", "Nagpur Skill Academy",
  "Bright Future Coaching", "Vidarbha Exam Board",
];

const EMPTY_DRAFT = {
  id: null, subject: "", topic: "", difficulty: "Moderate", marks: "1", negMarks: "0", language: "English",
  questionText: "",
  options: [{ id: 1, text: "" }, { id: 2, text: "" }, { id: 3, text: "" }, { id: 4, text: "" }],
  correctOption: null, correctOptions: [],
  tfAnswer: null,
};

export default function SuperadminQuestionBank() {
  const [tenant, setTenant] = useState(TENANTS[0]);
  const [excelFile, setExcelFile] = useState(null);
  const [pattern, setPattern] = useState("single");
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saved, setSaved] = useState([]);
  const [justSaved, setJustSaved] = useState(false);
  const [showAddAnother, setShowAddAnother] = useState(false);
  const submittedRecords = questionBankStore.useList();

  const patch = (p) => setDraft((d) => ({ ...d, ...p }));

  function handleSave(e) {
    e.preventDefault();
    if (!draft.questionText.trim()) return;

    // Editing a record that's already been submitted to the table below —
    // update it directly in the persisted store, then ask if they want to add another.
    if (draft.id && draft.id.startsWith("q-")) {
      questionBankStore.update(draft.id, { pattern, tenant, ...draft });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
      setShowAddAnother(true);
      return;
    }

    setSaved((s) => {
      if (draft.id) return s.map((q) => (q.id === draft.id ? { ...q, ...draft, pattern, tenant } : q));
      return [...s, { ...draft, id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, pattern, tenant }];
    });
    setDraft(EMPTY_DRAFT);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  }

  function handleEditQuestion(item) {
    setPattern(item.pattern);
    setTenant(item.tenant || TENANTS[0]);
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
    const records = saved.map((q, i) => ({ ...q, id: `q-${now}-${i}`, createdAt: now + i, status: "enabled" }));
    questionBankStore.addMany(records);
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

  const activePattern = QUESTION_PATTERNS.find((p) => p.id === pattern);

  return (
    <DashboardLayout
      role="superadmin" roleLabel="Superadmin Console" roleColor="#7c5cff"
      navItems={SUPERADMIN_NAV} userName="R. Kulkarni" userMeta="Superadmin · Full Access"
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="dashpage__heading">Global Question Bank</h1>
        <p className="dashpage__subheading">
          Manage the master question pool across every tenant, or scope your additions to a single organisation.
        </p>
      </motion.div>

      {/* ---- Tenant scope selector (superadmin-only) ---- */}
      <SectionCard title="Tenant Scope" subtitle="Choose who these questions belong to" delay={0.02}>
        <div className="sqbscope">
          <HiOutlineGlobeAlt className="sqbscope__icon" />
          <select className="sqbscope__select" value={tenant} onChange={(e) => setTenant(e.target.value)}>
            {TENANTS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <Badge tone={tenant === TENANTS[0] ? "info" : "neutral"}>
            {tenant === TENANTS[0] ? "Visible to all organisations" : "Visible to this tenant only"}
          </Badge>
        </div>
      </SectionCard>

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

      {/* ---- Manually-written question builder (7 patterns) ---- */}
      <SectionCard title="Write a Question Manually" subtitle="Choose a pattern, then fill in its fields" delay={0.12}>
        <div className="qpatterns">
          {QUESTION_PATTERNS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={"qpattern" + (pattern === p.id ? " qpattern--active" : "")}
              onClick={() => setPattern(p.id)}
            >
              <p.icon />
              <span>{p.label}</span>
            </button>
          ))}
        </div>

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

          <div className="qform__pattern">
            <span className="qform__patterntag"><activePattern.icon /> {activePattern.label}</span>
            <span className="qform__patternhint">{activePattern.hint}</span>
          </div>

          <PatternFields pattern={pattern} draft={draft} setDraft={setDraft} />

          <div className="qform__footer">
            <button type="submit" className="qform__save">
              {draft.id ? "Update Question" : `Save to ${tenant === TENANTS[0] ? "Global Pool" : tenant}`}
            </button>
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
      <SectionCard title={`Global Question Bank (${submittedRecords.length})`} subtitle="Search, page through, preview or enable/disable any question" delay={0.24}>
        <SubmittedQuestionsTable
          records={submittedRecords}
          onToggleStatus={questionBankStore.setStatus}
          onEdit={handleEditQuestion}
          onDelete={questionBankStore.remove}
          extraColumns={[{ key: "tenant", label: "Tenant", sortable: true, render: (r) => r.tenant || TENANTS[0] }]}
        />
      </SectionCard>

      <SavedQuestionsGlow items={saved} patterns={QUESTION_PATTERNS} onEdit={handleEditQuestion} onDelete={handleDeleteDraft} />

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

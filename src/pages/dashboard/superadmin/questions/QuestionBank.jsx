import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineArrowDownTray, HiOutlineArrowUpTray, HiOutlineDocumentCheck,
  HiOutlineCheckCircle, HiOutlineGlobeAlt, HiOutlinePaperAirplane, HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import SectionCard from "../../../../dashboard/widgets/SectionCard";
import SavedQuestionsGlow from "../../../../dashboard/widgets/SavedQuestionsGlow";
import SubmittedQuestionsTable from "../../../../dashboard/widgets/SubmittedQuestionsTable";
import ConfirmPrompt from "../../../../dashboard/widgets/ConfirmPrompt";
import { createQuestionBankStore } from "../../../../dashboard/questionBankStore";
import { downloadSampleExcel, parseQuestionExcel } from "../../../../dashboard/questionExcel";
import { Badge } from "../../../../dashboard/widgets/Misc";
import { SUPERADMIN_NAV } from "../superadminNav";
import PatternFields from "./PatternFields";
import "../../../../dashboard/DashboardShared.css";
import "../../admin/questions/QuestionBank.css";
import "./SuperadminQuestionBank.css";
import { addQuestion } from "../../../../api/authApi"
const questionBankStore = createQuestionBankStore("questionBankRecords_superadmin_v1");

const TENANTS = [
  "All Tenants (Global Pool)", "TechPrep Institute", "Nagpur Skill Academy",
  "Bright Future Coaching", "Vidarbha Exam Board",
];

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

export default function SuperadminQuestionBank() {
  const [tenant, setTenant] = useState(TENANTS[0]);
  const [excelFile, setExcelFile] = useState(null);
  const [excelBusy, setExcelBusy] = useState(false);
  const [excelResult, setExcelResult] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saved, setSaved] = useState([]);
  const [justSaved, setJustSaved] = useState(false);
  const [showAddAnother, setShowAddAnother] = useState(false);
  const submittedRecords = questionBankStore.useList();

  const patch = (p) => setDraft((d) => ({ ...d, ...p }));

  async function handleUploadExcel() {
    if (!excelFile) return;
    setExcelBusy(true);
    setExcelResult(null);
    try {
      const { valid, errors } = await parseQuestionExcel(excelFile);
      if (valid.length > 0) {
        setSaved((s) => [
          ...s,
          ...valid.map((q) => ({
            ...q,
            id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            tenant,
          })),
        ]);
      }
      setExcelResult({ added: valid.length, errors });
    } catch (err) {
      setExcelResult({ added: 0, errors: [{ row: "-", message: err.message }] });
    } finally {
      setExcelBusy(false);
      setExcelFile(null);
    }
  }

  // function handleSave(e) {
  //   e.preventDefault();
  //   if (!draft.questionText.trim()) return;

  //   // Editing one question that lives inside an already-submitted batch row —
  //   // update just that question in place, then ask if they want to add another.
  //   if (draft._batchId) {
  //     const { _batchId, _batchIndex, ...clean } = draft;
  //     questionBankStore.updateQuestionInBatch(_batchId, _batchIndex, { tenant, ...clean });
  //     setJustSaved(true);
  //     setTimeout(() => setJustSaved(false), 1800);
  //     setShowAddAnother(true);
  //     return;
  //   }

  //   setSaved((s) => {
  //     if (draft.id) return s.map((q) => (q.id === draft.id ? { ...q, ...draft, tenant } : q));
  //     return [...s, { ...draft, id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, tenant }];
  //   });
  //   setDraft(EMPTY_DRAFT);
  //   setJustSaved(true);
  //   setTimeout(() => setJustSaved(false), 1800);
  // }
  async function handleSave(e) {
    e.preventDefault();

    if (!draft.questionText.trim()) {
      alert("Please enter a question.");
      return;
    }

    const selectedCorrectOption = draft.correctOptions?.[0] ?? 1;

    const now = new Date().toISOString();

    const payload = {
      sCategory: draft.category || null,
      sSubName: Number(draft.subject),          // Subject ID
      sLevel: Number(draft.difficulty),         // Difficulty ID

      sQue1: draft.questionText,
      sQueE1: draft.questionHindi || draft.questionText,

      sOption1: draft.options[0]?.text || "",
      sOptionE1: draft.options[0]?.hindi || draft.options[0]?.text || "",

      sOption2: draft.options[1]?.text || "",
      sOptionE2: draft.options[1]?.hindi || draft.options[1]?.text || "",

      sOption3: draft.options[2]?.text || "",
      sOptionE3: draft.options[2]?.hindi || draft.options[2]?.text || "",

      sOption4: draft.options[3]?.text || "",
      sOptionE4: draft.options[3]?.hindi || draft.options[3]?.text || "",

      sOption5: draft.options[4]?.text || "",
      sOptionE5: draft.options[4]?.hindi || draft.options[4]?.text || "",

      sOption6: draft.options[5]?.text || "",
      sOptionE6: draft.options[5]?.hindi || draft.options[5]?.text || "",

      sOption7: draft.options[6]?.text || "",
      sOptionE7: draft.options[6]?.hindi || draft.options[6]?.text || "",

      sOption8: draft.options[7]?.text || "",
      sOptionE8: draft.options[7]?.hindi || draft.options[7]?.text || "",

      // API expects this property name
      sFLag: Number(selectedCorrectOption),

      RegDate: now,
      ModDate: now,
      nBit: true,
      nSABit: true,
    };

    try {
      const response = await addQuestion(payload);

      console.log("Question Added:", response.data);

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);

      setSaved((prev) => [
        ...prev,
        {
          ...draft,
          id:
            response.data?.nID ||
            response.data?.nQueId ||
            response.data?.id ||
            Date.now(),
          tenant,
        },
      ]);

      setDraft(EMPTY_DRAFT);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to save question."
      );
    }
  }

  function handleEditQuestion(item) {
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
    const batch = {
      id: `batch-${now}`,
      createdAt: now,
      status: "enabled",
      tenant,
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
          <a
            href="#" className="qexcel__sample"
            onClick={(e) => { e.preventDefault(); downloadSampleExcel(); }}
          >
            <HiOutlineArrowDownTray /> Download Sample Excel
          </a>
          <label className="qexcel__drop">
            <HiOutlineArrowUpTray />
            <span>{excelFile ? excelFile.name : "Click to choose a .xls / .xlsx file, or drag it here"}</span>
            <input
              type="file" accept=".xls,.xlsx" hidden
              onChange={(e) => { setExcelFile(e.target.files[0] || null); setExcelResult(null); }}
            />
          </label>
          <button type="button" className="qexcel__submit" disabled={!excelFile || excelBusy} onClick={handleUploadExcel}>
            <HiOutlineDocumentCheck /> {excelBusy ? "Validating…" : "Upload & Validate"}
          </button>
        </div>

        {excelResult && (
          <div className="qexcel__result">
            {excelResult.added > 0 && (
              <div className="qexcel__resultok">
                <HiOutlineCheckCircle />
                {excelResult.added} question{excelResult.added === 1 ? "" : "s"} added to <strong>{tenant}</strong> — review them in the "Saved" bubble bottom-right, then hit Submit below.
              </div>
            )}
            {excelResult.errors.length > 0 && (
              <div className="qexcel__resulterr">
                <div className="qexcel__resulterrhead">
                  <HiOutlineExclamationTriangle />
                  {excelResult.errors.length} row{excelResult.errors.length === 1 ? "" : "s"} skipped
                </div>
                <ul>
                  {excelResult.errors.slice(0, 8).map((er, i) => (
                    <li key={i}>Row {er.row}: {er.message}</li>
                  ))}
                  {excelResult.errors.length > 8 && <li>…and {excelResult.errors.length - 8} more</li>}
                </ul>
              </div>
            )}
          </div>
        )}
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
          onDeleteQuestion={questionBankStore.removeQuestionFromBatch}
          extraColumns={[{ key: "tenant", label: "Tenant", sortable: true, render: (r) => r.tenant || TENANTS[0] }]}
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

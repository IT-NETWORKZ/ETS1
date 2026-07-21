import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlinePencilSquare, HiOutlineXMark, HiOutlinePhoto } from "react-icons/hi2";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import SectionCard from "../../../../dashboard/widgets/SectionCard";
import RichTextEditor from "../../../../dashboard/widgets/RichTextEditor";
import InstructionsTable from "../../../../dashboard/widgets/InstructionsTable";
import { EXAM_TYPES } from "../../../../dashboard/examTypesList";
import {
  useInstructionsList, upsertInstruction, setInstructionStatus,
} from "../../../../dashboard/examInstructionsStore";
import { ADMIN_NAV } from "../adminNav";
import "../../../../dashboard/DashboardShared.css";
import "./ExamInstructions.css";

const BLANK = { id: null, examName: "", examType: EXAM_TYPES[0].id, content: "", image: "" };

export default function ExamInstructions() {
  const [form, setForm] = useState(BLANK);
  const [justSaved, setJustSaved] = useState(false);
  const records = useInstructionsList();

  const isEditing = Boolean(form.id);
  const patch = (p) => setForm((f) => ({ ...f, ...p }));

  function handleSave(e) {
    e.preventDefault();
    if (!form.examName.trim()) return;
    upsertInstruction(form);
    setForm(BLANK);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  }

  function handleEdit(rec) {
    setForm({ id: rec.id, examName: rec.examName, examType: rec.examType, content: rec.content, image: rec.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const typeLabel = (id) => EXAM_TYPES.find((t) => t.id === id)?.label || id;

  return (
    <DashboardLayout
      role="admin" roleLabel="Organisation Admin" roleColor="#2f7dd1"
      navItems={ADMIN_NAV} userName="Rohit Deshmukh" userMeta="Org Admin · TechPrep Institute"
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="dashpage__heading">Exam Instructions</h1>
        <p className="dashpage__subheading">
          Write how an exam works and enable it — it reflects live on that exam's page for every candidate.
        </p>
      </motion.div>

      <SectionCard
        title={isEditing ? `Editing "${form.examName || "Untitled"}"` : "Add New Instructions"}
        subtitle={isEditing ? "Update the fields below, then save to apply your changes." : undefined}
        className={isEditing ? "einstr__card--editing" : ""}
        delay={0.05}
      >
        <AnimatePresence>
          {isEditing && (
            <motion.div
              className="einstr__editbanner"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HiOutlinePencilSquare /> You're editing an existing instruction set — changes apply immediately on save.
            </motion.div>
          )}
        </AnimatePresence>

        <form className="einstr__form" onSubmit={handleSave}>
          <div className="einstr__row">
            <label className="einstr__field">
              <span className="einstr__label">Exam Name</span>
              <input
                className="einstr__input"
                type="text"
                placeholder="e.g. Demo Exam — Standard Instructions"
                value={form.examName}
                onChange={(e) => patch({ examName: e.target.value })}
              />
            </label>

            <label className="einstr__field">
              <span className="einstr__label">Exam Type</span>
              <select className="einstr__select" value={form.examType} onChange={(e) => patch({ examType: e.target.value })}>
                {EXAM_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="einstr__field">
            <span className="einstr__label">Instructions</span>
            <RichTextEditor
              value={form.content}
              onChange={(html) => patch({ content: html })}
              placeholder="Explain how this exam works — timer, navigation, violation rules, result release..."
            />
          </label>

          <label className="einstr__field">
            <span className="einstr__label"><HiOutlinePhoto style={{ verticalAlign: "-3px", marginRight: 4 }} />Instruction Image (optional, URL)</span>
            <input
              className="einstr__input"
              type="text"
              placeholder="https://... — shown in the Preview popup"
              value={form.image}
              onChange={(e) => patch({ image: e.target.value })}
            />
          </label>

          <div className="einstr__footer">
            <button type="submit" className="einstr__save">
              <HiOutlinePencilSquare /> {isEditing ? "Update Instructions" : "Save Instructions"}
            </button>
            {isEditing && (
              <button type="button" className="einstr__cancel" onClick={() => setForm(BLANK)}>
                <HiOutlineXMark /> Cancel edit
              </button>
            )}
            <AnimatePresence>
              {justSaved && (
                <motion.span
                  className="einstr__savedtag"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                >
                  <HiOutlineCheckCircle /> Saved
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={`All Instructions (${records.length})`} subtitle="Search, page through, and click the pencil to edit any instruction set" delay={0.12}>
        <InstructionsTable
          records={records}
          typeLabel={typeLabel}
          onEdit={handleEdit}
          onToggleStatus={setInstructionStatus}
        />
      </SectionCard>
    </DashboardLayout>
  );
}

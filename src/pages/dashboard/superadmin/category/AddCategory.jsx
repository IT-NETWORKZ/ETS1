import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlinePlusCircle } from "react-icons/hi2";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import SectionCard from "../../../../dashboard/widgets/SectionCard";
import MasterTable from "../../../../dashboard/widgets/MasterTable";
import StatusToggle from "../../../../dashboard/widgets/StatusToggle";
import { SUPERADMIN_NAV } from "../superadminNav";
import { addCategory, setCategoryStatus, useCategoryList } from "../../../../dashboard/categoryStore";
import "../../../../dashboard/DashboardShared.css";
import "../../admin/questions/QuestionBank.css";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const categories = useCategoryList();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory(name);
    setName("");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  // Precompute Sr.No and a display-friendly date on the sorted list, same
  // pattern as InstructionsTable — MasterTable's render(row) only receives
  // the row itself, not the page index, so this has to happen up front.
  const rows = categories.map((r, i) => ({
    ...r,
    srNo: i + 1,
    dateText: new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  }));

  const columns = [
    { key: "srNo", label: "Sr.No", sortable: true },
    { key: "dateText", label: "Date", sortable: true },
    { key: "name", label: "Category Name", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusToggle
          enabled={row.status === "enabled"}
          onToggle={() => setCategoryStatus(row.id, row.status === "enabled" ? "disabled" : "enabled")}
        />
      ),
    },
  ];

  return (
    <DashboardLayout
      role="superadmin" roleLabel="Superadmin Console" roleColor="#7c5cff"
      navItems={SUPERADMIN_NAV} userName="R. Kulkarni" userMeta="Superadmin · Full Access"
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="dashpage__heading">Add Category</h1>
        <p className="dashpage__subheading">Create and manage exam/question categories.</p>
      </motion.div>

      <SectionCard title="New Category" subtitle="Enter a category name and submit" delay={0.05}>
        <form className="qform" onSubmit={handleSubmit}>
          <div className="qform__common">
            <label className="qfield">
              <span className="qfield__label">Category Name</span>
              <input
                type="text"
                placeholder="e.g. Quantitative Aptitude"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          <div className="qform__footer">
            <button type="submit" className="qform__save">
              <HiOutlinePlusCircle /> Submit
            </button>
            <AnimatePresence>
              {justAdded && (
                <motion.span
                  className="qform__savedtag"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                >
                  <HiOutlineCheckCircle /> Category added
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={`Categories (${categories.length})`} subtitle="Search, page through, or enable/disable any category" delay={0.15}>
        <MasterTable
          columns={columns}
          rows={rows}
          searchKeys={["name"]}
          keyField="id"
        />
      </SectionCard>
    </DashboardLayout>
  );
}

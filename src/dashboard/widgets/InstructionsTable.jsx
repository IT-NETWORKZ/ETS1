import { HiOutlinePencil } from "react-icons/hi2";
import MasterTable from "./MasterTable";
import StatusToggle from "./StatusToggle";
import "./InstructionsTable.css";

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return div.textContent || div.innerText || "";
}

export default function InstructionsTable({ records, typeLabel, onEdit, onToggleStatus }) {
  const rows = records.map((r, i) => ({
    ...r,
    srNo: i + 1,
    typeLabelText: typeLabel(r.examType),
    contentPlain: stripHtml(r.content),
  }));

  const columns = [
    { key: "srNo", label: "Sr. No.", sortable: true },
    { key: "examName", label: "Exam Name", sortable: true, render: (r) => <span className="instr__tdname">{r.examName}</span> },
    { key: "typeLabelText", label: "Exam Type", sortable: true, render: (r) => <span className="instr__typepill">{r.typeLabelText}</span> },
    {
      key: "contentPlain", label: "Content",
      render: (r) => <span className="instr__snippet">{r.contentPlain.slice(0, 70) || "Empty"}{r.contentPlain.length > 70 ? "…" : ""}</span>,
    },
    { key: "edit", label: "Edit", render: (r) => (
        <button type="button" className="instr__editbtn" onClick={() => onEdit(r)} title="Edit"><HiOutlinePencil /></button>
      ) },
    { key: "status", label: "Status", render: (r) => (
        <StatusToggle enabled={r.status === "enabled"} onToggle={() => onToggleStatus(r.id, r.status === "enabled" ? "disabled" : "enabled")} />
      ) },
  ];

  return (
    <MasterTable
      columns={columns}
      rows={rows}
      searchKeys={["examName", "typeLabelText", "contentPlain"]}
      keyField="id"
    />
  );
}

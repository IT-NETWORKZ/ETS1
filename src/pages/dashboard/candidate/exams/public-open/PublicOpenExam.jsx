import { useState } from "react";
import { HiOutlineTicket, HiOutlineArrowRight } from "react-icons/hi2";
import DashboardLayout from "../../../../../dashboard/DashboardLayout";
import ExamTypeInfo from "../../../../../dashboard/widgets/ExamTypeInfo";
import { CANDIDATE_NAV } from "../../candidateNav";
import "../../../../../dashboard/DashboardShared.css";

export default function PublicOpenExam() {
  const [code, setCode] = useState("");

  return (
    <DashboardLayout
      role="candidate" roleLabel="Candidate Dashboard" roleColor="var(--leaf-500)"
      navItems={CANDIDATE_NAV} userName="Amrapali Ambade" userMeta="Candidate · Master Plan"
    >
      <ExamTypeInfo
        icon={HiOutlineTicket}
        tone="#7c5cff"
        title="Public / Open Exam"
        examId="public-open"
        purpose="Registration through a shared link, code or QR — anyone with access can join."
        result="As configured by the organiser"
        certificate="As configured by the organiser"
      >
        <form className="examtype__codeform" onSubmit={(e) => e.preventDefault()}>
          <input
            className="examtype__codeinput"
            placeholder="Enter exam code (e.g. EXM-4821)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="examtype__cta">
            Join Exam <HiOutlineArrowRight />
          </button>
        </form>
      </ExamTypeInfo>
    </DashboardLayout>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineTicket, HiOutlineArrowRight } from "react-icons/hi2";
import DashboardLayout from "../../../../../dashboard/DashboardLayout";
import ExamTypeInfo from "../../../../../dashboard/widgets/ExamTypeInfo";
import { CANDIDATE_NAV } from "../../candidateNav";
import "../../../../../dashboard/DashboardShared.css";

export default function PublicOpenExam() {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const navigate = useNavigate();

  // There's no backend here to look up a real organiser-issued code against, so
  // this just checks it's non-empty and hands off to the same shuffled exam
  // runner Quick/Custom Practice use — swap this for a real lookup once exam
  // codes are issued server-side.
  function handleJoin(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setCodeError("Enter the exam code you were given.");
      return;
    }
    setCodeError("");
    navigate("/dashboard/candidate/exams/exam");
  }

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
        <form className="examtype__codeform" onSubmit={handleJoin}>
          <input
            className="examtype__codeinput"
            placeholder="Enter exam code (e.g. EXM-4821)"
            value={code}
            onChange={(e) => { setCode(e.target.value); setCodeError(""); }}
          />
          <button type="submit" className="examtype__cta">
            Join Exam <HiOutlineArrowRight />
          </button>
        </form>
        {codeError && <p className="examtype__codeerror">{codeError}</p>}
      </ExamTypeInfo>
    </DashboardLayout>
  );
}

import { Link } from "react-router-dom";
import { HiOutlineBolt, HiOutlineArrowRight } from "react-icons/hi2";
import DashboardLayout from "../../../../../dashboard/DashboardLayout";
import ExamTypeInfo from "../../../../../dashboard/widgets/ExamTypeInfo";
import { CANDIDATE_NAV } from "../../candidateNav";
import "../../../../../dashboard/DashboardShared.css";

export default function QuickPractice() {
  return (
    <DashboardLayout
      role="candidate" roleLabel="Candidate Dashboard" roleColor="var(--leaf-500)"
      navItems={CANDIDATE_NAV} userName="Amrapali Ambade" userMeta="Candidate · Master Plan"
    >
      <ExamTypeInfo
        icon={HiOutlineBolt}
        tone="#f5a524"
        title="Quick Practice"
        examId="quick-practice"
        purpose="A fast self-check — jump straight into a short, auto-picked question set."
        result="Immediate"
        certificate="No"
      >
        <Link to="/dashboard/candidate/exams/exam" className="examtype__cta">
          Start Quick Practice <HiOutlineArrowRight />
        </Link>
      </ExamTypeInfo>
    </DashboardLayout>
  );
}

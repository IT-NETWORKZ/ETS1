import { Link } from "react-router-dom";
import { HiOutlinePencilSquare, HiOutlineArrowRight } from "react-icons/hi2";
import DashboardLayout from "../../../../../dashboard/DashboardLayout";
import ExamTypeInfo from "../../../../../dashboard/widgets/ExamTypeInfo";
import { CANDIDATE_NAV } from "../../candidateNav";
import "../../../../../dashboard/DashboardShared.css";

export default function CustomPractice() {
  return (
    <DashboardLayout
      role="candidate" roleLabel="Candidate Dashboard" roleColor="var(--leaf-500)"
      navItems={CANDIDATE_NAV} userName="Amrapali Ambade" userMeta="Candidate · Master Plan"
    >
      <ExamTypeInfo
        icon={HiOutlinePencilSquare}
        tone="#2f7dd1"
        title="Custom Practice"
        examId="custom-practice"
        purpose="A user-defined self-assessment — choose subject, topic, difficulty, question count and duration yourself."
        result="Immediate, with explanations shown as configured"
        certificate="No"
      >
        <Link to="/dashboard/candidate/exams/exam" className="examtype__cta">
          Build a Practice Exam <HiOutlineArrowRight />
        </Link>
      </ExamTypeInfo>
    </DashboardLayout>
  );
}

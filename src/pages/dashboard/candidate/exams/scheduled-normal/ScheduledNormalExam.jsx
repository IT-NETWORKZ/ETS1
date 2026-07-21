import { HiOutlineShieldCheck, HiOutlineInformationCircle } from "react-icons/hi2";
import DashboardLayout from "../../../../../dashboard/DashboardLayout";
import ExamTypeInfo from "../../../../../dashboard/widgets/ExamTypeInfo";
import { CANDIDATE_NAV } from "../../candidateNav";
import "../../../../../dashboard/DashboardShared.css";

export default function ScheduledNormalExam() {
  return (
    <DashboardLayout
      role="candidate" roleLabel="Candidate Dashboard" roleColor="var(--leaf-500)"
      navItems={CANDIDATE_NAV} userName="Amrapali Ambade" userMeta="Candidate · Master Plan"
    >
      <ExamTypeInfo
        icon={HiOutlineShieldCheck}
        tone="#2f7dd1"
        title="Scheduled Normal Exam"
        examId="scheduled-normal"
        purpose="An organisation assessment without live proctoring — assigned to you by an admin."
        result="Immediate, held, or released on a schedule"
        certificate="Eligible if pass criteria met"
      >
        <div className="examtype__empty">
          <HiOutlineInformationCircle />
          <span>No scheduled normal exams are assigned to you right now. They'll appear here — and on your Overview page — as soon as an organisation invites you.</span>
        </div>
      </ExamTypeInfo>
    </DashboardLayout>
  );
}

import { HiOutlineVideoCamera, HiOutlineInformationCircle } from "react-icons/hi2";
import DashboardLayout from "../../../../../dashboard/DashboardLayout";
import ExamTypeInfo from "../../../../../dashboard/widgets/ExamTypeInfo";
import { CANDIDATE_NAV } from "../../candidateNav";
import "../../../../../dashboard/DashboardShared.css";

export default function ScheduledProctoredExam() {
  return (
    <DashboardLayout
      role="candidate" roleLabel="Candidate Dashboard" roleColor="var(--leaf-500)"
      navItems={CANDIDATE_NAV} userName="Amrapali Ambade" userMeta="Candidate · Master Plan"
    >
      <ExamTypeInfo
        icon={HiOutlineVideoCamera}
        tone="#d9534f"
        title="Scheduled Proctored Exam"
        examId="scheduled-proctored"
        purpose="An organisation assessment with monitoring — a proctor watches your session for integrity."
        result="Held, or released on a schedule after proctor review"
        certificate="Eligible if pass criteria met"
      >
        <div className="examtype__empty">
          <HiOutlineInformationCircle />
          <span>No proctored exams are assigned yet. Before one starts you'll be asked to complete a camera, microphone and connection check.</span>
        </div>
      </ExamTypeInfo>
    </DashboardLayout>
  );
}

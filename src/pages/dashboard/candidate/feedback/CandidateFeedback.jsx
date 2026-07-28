import { motion } from "framer-motion";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import FeedbackForm from "../../../../dashboard/widgets/FeedbackForm";
import { CANDIDATE_NAV } from "../candidateNav";
import "../../../../dashboard/DashboardShared.css";

export default function CandidateFeedback() {
  return (
    <DashboardLayout
      role="candidate"
      roleLabel="Candidate Dashboard"
      roleColor="var(--leaf-500)"
      navItems={CANDIDATE_NAV}
      userName="Amrapali Ambade"
      userMeta="Candidate · Master Plan"
    >
      <motion.div className="feedback__header" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="dashpage__heading">Feedback</h1>
        <p className="dashpage__subheading">Tell us about your experience — your rating and comments help us improve.</p>
      </motion.div>

      <div style={{ marginTop: 22 }}>
        <FeedbackForm role="candidate" roleColor="var(--leaf-500)" />
      </div>
    </DashboardLayout>
  );
}

import { motion } from "framer-motion";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import SectionCard from "../../../../dashboard/widgets/SectionCard";
import FeedbackTable from "../../../../dashboard/widgets/FeedbackTable";
import { SUPERADMIN_NAV } from "../superadminNav";
import "../../../../dashboard/DashboardShared.css";

export default function SuperadminCandidateFeedback() {
  return (
    <DashboardLayout
      role="superadmin" roleLabel="Superadmin Console" roleColor="#7c5cff"
      navItems={SUPERADMIN_NAV} userName="R. Kulkarni" userMeta="Superadmin · Full Access"
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="dashpage__heading">Candidate Feedback</h1>
        <p className="dashpage__subheading">Ratings and messages submitted by candidates.</p>
      </motion.div>

      <SectionCard delay={0.1}>
        <FeedbackTable role="candidate" />
      </SectionCard>
    </DashboardLayout>
  );
}

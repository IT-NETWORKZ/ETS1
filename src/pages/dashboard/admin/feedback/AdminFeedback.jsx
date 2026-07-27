import { motion } from "framer-motion";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import FeedbackForm from "../../../../dashboard/widgets/FeedbackForm";
import { ADMIN_NAV } from "../adminNav";
import "../../../../dashboard/DashboardShared.css";

export default function AdminFeedback() {
  return (
    <DashboardLayout
      role="admin"
      roleLabel="Admin Dashboard"
      roleColor="#2f7dd1"
      navItems={ADMIN_NAV}
      userName="Admin"
      userMeta="Organisation Admin"
    >
     <motion.div
  className="feedback__header"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  <h1 className="dashpage__heading">Feedback</h1>
  <p className="dashpage__subheading">
    Share your experience running exams on the platform.
  </p>
</motion.div>

      <div style={{ marginTop: 22 }}>
        <FeedbackForm role="admin" roleColor="#2f7dd1" />
      </div>
    </DashboardLayout>
  );
}

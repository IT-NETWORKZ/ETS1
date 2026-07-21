import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlinePlayCircle, HiOutlineSparkles, HiOutlineNoSymbol,
  HiOutlineArrowPath, HiOutlinePhoto, HiOutlineArrowRight, HiOutlineInformationCircle,
} from "react-icons/hi2";
import DashboardLayout from "../../../../../dashboard/DashboardLayout";
import { useEnabledInstructions } from "../../../../../dashboard/examInstructionsStore";
import { CANDIDATE_NAV } from "../../candidateNav";
import "../../../../../dashboard/DashboardShared.css";
import "./DemoExam.css";

export default function DemoExamPage() {
  const instructions = useEnabledInstructions("demo");

  return (
    <DashboardLayout
      role="candidate"
      roleLabel="Candidate Dashboard"
      roleColor="var(--leaf-500)"
      navItems={CANDIDATE_NAV}
      userName="Amrapali Ambade"
      userMeta="Candidate · Master Plan"
    >
      <motion.div
        className="demoshowcase"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="demoshowcase__glow" />

        <span className="demoshowcase__eyebrow">
          <HiOutlineSparkles /> Demo Exam
        </span>
        <h1 className="demoshowcase__title">See exactly how an exam feels — before it counts.</h1>
        <p className="demoshowcase__desc">
          The Demo Exam exists purely to show the platform experience. Timer, question palette,
          autosave, review screen — everything works exactly like a real exam, except nothing you do
          here affects your score, history or subscription quota.
        </p>

        <div className="demoshowcase__facts">
          <div className="demoshowcase__fact">
            <HiOutlinePlayCircle />
            <div><strong>Immediate</strong><span>Result shown the moment you submit</span></div>
          </div>
          <div className="demoshowcase__fact">
            <HiOutlineNoSymbol />
            <div><strong>No Certificate</strong><span>Demo attempts are never accredited</span></div>
          </div>
          <div className="demoshowcase__fact">
            <HiOutlineArrowPath />
            <div><strong>Unlimited Retries</strong><span>Replay it as many times as you like</span></div>
          </div>
        </div>

        <div className="demoshowcase__imageslot">
          <HiOutlinePhoto />
          <span>Screenshot / walkthrough image goes here</span>
        </div>

        {instructions.length > 0 && (
          <div className="demoshowcase__instructions">
            <HiOutlineInformationCircle />
            <div>
              <span>Exam Instructions</span>
              {instructions.map((rec) => (
                <div key={rec.id} dangerouslySetInnerHTML={{ __html: rec.content }} />
              ))}
            </div>
          </div>
        )}

        <Link to="/demo-exam" className="demoshowcase__cta">
          Launch Demo Exam <HiOutlineArrowRight />
        </Link>
      </motion.div>
    </DashboardLayout>
  );
}

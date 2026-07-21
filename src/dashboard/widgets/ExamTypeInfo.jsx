import { motion } from "framer-motion";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { useEnabledInstructions } from "../examInstructionsStore";
import "./ExamTypeInfo.css";

export default function ExamTypeInfo({ icon: Icon, tone, title, purpose, result, certificate, examId, children }) {
  const instructions = useEnabledInstructions(examId);

  return (
    <motion.div
      className="examtype"
      style={{ "--tone": tone }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="examtype__icon"><Icon /></div>
      <h1 className="examtype__title">{title}</h1>

      <div className="examtype__facts">
        <div className="examtype__fact">
          <span className="examtype__factlabel">Purpose</span>
          <span className="examtype__factvalue">{purpose}</span>
        </div>
        <div className="examtype__fact">
          <span className="examtype__factlabel">Typical Result</span>
          <span className="examtype__factvalue">{result}</span>
        </div>
        <div className="examtype__fact">
          <span className="examtype__factlabel">Certificate</span>
          <span className="examtype__factvalue">{certificate}</span>
        </div>
      </div>

      {instructions.length > 0 && (
        <div className="examtype__instructions">
          <HiOutlineInformationCircle />
          <div>
            <span className="examtype__instructionslabel">Exam Instructions</span>
            {instructions.map((rec) => (
              <div className="examtype__instructionsbody" key={rec.id} dangerouslySetInnerHTML={{ __html: rec.content }} />
            ))}
          </div>
        </div>
      )}

      <div className="examtype__action">{children}</div>
    </motion.div>
  );
}

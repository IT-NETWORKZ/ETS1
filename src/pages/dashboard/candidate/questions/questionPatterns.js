import {
  HiOutlineListBullet, HiOutlineCheckCircle, HiOutlineAdjustmentsHorizontal,
  HiOutlineDocumentText, HiOutlinePhoto, HiOutlineBookOpen, HiOutlineArrowUpTray,
} from "react-icons/hi2";

// 7 manually-authored question patterns (PRD §12.1 consolidated: audio/video
// reuse the same media-upload pattern as "Image / Media-based").
export const QUESTION_PATTERNS = [
  {
    id: "single",
    label: "Single-choice MCQ",
    icon: HiOutlineListBullet,
    hint: "One correct option out of several.",
  },
  {
    id: "multi",
    label: "Multiple-select",
    icon: HiOutlineCheckCircle,
    hint: "More than one correct option; exact-match or weighted.",
  },
  {
    id: "truefalse",
    label: "True / False",
    icon: HiOutlineAdjustmentsHorizontal,
    hint: "Two controlled options only.",
  },
  {
    id: "descriptive",
    label: "Descriptive",
    icon: HiOutlineDocumentText,
    hint: "Manually or AI-assisted evaluation with a rubric.",
  },
  {
    id: "media",
    label: "Image / Media-based",
    icon: HiOutlinePhoto,
    hint: "Image, audio or video stimulus attached to the question.",
  },
  {
    id: "passage",
    label: "Passage / Case Study",
    icon: HiOutlineBookOpen,
    hint: "Shared stimulus with multiple child questions.",
  },
  {
    id: "upload",
    label: "File Upload / Recorded Response",
    icon: HiOutlineArrowUpTray,
    hint: "Candidate submits a file; manual evaluation.",
  },
];

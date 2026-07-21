import {
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlinePencilSquare,
  HiOutlineDocument,
  HiOutlineShieldCheck,
  HiOutlineVideoCamera,
  HiOutlineTicket,
  HiOutlineRectangleGroup,
} from "react-icons/hi2";

export const CANDIDATE_NAV = [
  {
    to: "/dashboard/candidate",
    label: "Overview",
    icon: HiOutlineChartBar,
    end: true,
  },

 {
  label: "Exams",
  icon: HiOutlineRectangleGroup,
  children: [
    {
      to: "/dashboard/candidate/exams/demo",
      label: "Demo Exam",
      icon: HiOutlineSparkles,
    },
    {
      to: "/dashboard/candidate/exams/quick-practice",
      label: "Quick Practice",
      icon: HiOutlineBolt,
    },
    {
      to: "/dashboard/candidate/exams/custom-practice",
      label: "Custom Practice",
      icon: HiOutlinePencilSquare,
    },
    {
      to: "/dashboard/candidate/exams/scheduled-normal",
      label: "Scheduled Exam",
      icon: HiOutlineShieldCheck,
    },
    {
      to: "/dashboard/candidate/exams/scheduled-proctored",
      label: "Proctored Exam",
      icon: HiOutlineVideoCamera,
    },
    {
      to: "/dashboard/candidate/exams/public-open",
      label: "Public / Open Exam",
      icon: HiOutlineTicket,
    },
  ],
},

  {
    to: "/exam-price",
    label: "Subscription",
    icon: HiOutlineAcademicCap,
  },

  {
    to: "/dashboard/candidate/questions",
    label: "Question Bank",
    icon: HiOutlineDocument,
  },

  {
    to: "/dashboard/candidate/profile",
    label: "My Profile",
    icon: HiOutlineDocumentText,
  },
];
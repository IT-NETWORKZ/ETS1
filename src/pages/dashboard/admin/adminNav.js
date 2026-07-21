import {
  HiOutlineSquares2X2, HiOutlineUsers, HiOutlineClipboardDocumentCheck,
  HiOutlineChatBubbleLeftRight, HiOutlineDocumentPlus, HiOutlineChatBubbleBottomCenterText,
} from "react-icons/hi2";

export const ADMIN_NAV = [
  { to: "/dashboard/admin", label: "Overview", icon: HiOutlineSquares2X2, end: true },
  { to: "/dashboard/admin", label: "Candidates & Groups", icon: HiOutlineUsers },
  { to: "/dashboard/admin/questions", label: "Question Bank", icon: HiOutlineDocumentPlus },
  { to: "/dashboard/admin/instructions", label: "Exam Instructions", icon: HiOutlineChatBubbleBottomCenterText },
  { to: "/exam-price", label: "Subscription", icon: HiOutlineClipboardDocumentCheck },
  { to: "/tech-support", label: "Support", icon: HiOutlineChatBubbleLeftRight },
];

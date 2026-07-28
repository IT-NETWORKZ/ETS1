import {
  HiOutlineSquares2X2, HiOutlineUsers, HiOutlineClipboardDocumentCheck,
  HiOutlineChatBubbleLeftRight, HiOutlineDocumentPlus, HiOutlineChatBubbleBottomCenterText,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";

export const ADMIN_NAV = [
  { to: "/dashboard/admin", label: "Overview", icon: HiOutlineSquares2X2, end: true },
  { to: "/dashboard/admin", label: "Candidates & Groups", icon: HiOutlineUsers },
  { to: "/dashboard/admin/questions", label: "Question Bank", icon: HiOutlineDocumentPlus },
  { to: "/dashboard/admin/instructions", label: "Exam Instructions", icon: HiOutlineChatBubbleBottomCenterText },
  { to: "/dashboard/admin/feedback", label: "Feedback", icon: HiOutlineChatBubbleLeftEllipsis },
  { to: "/dashboard/admin/pricing-plans", label: "Subscription", icon: HiOutlineClipboardDocumentCheck },
  { to: "/tech-support", label: "Support", icon: HiOutlineChatBubbleLeftRight },
];

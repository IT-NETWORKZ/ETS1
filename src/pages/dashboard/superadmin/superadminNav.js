import {
  HiOutlineGlobeAlt, HiOutlineBuildingOffice2, HiOutlineUserGroup, HiOutlineBanknotes,
  HiOutlineShieldCheck, HiOutlineDocumentMagnifyingGlass, HiOutlineChatBubbleBottomCenterText,
  HiOutlineTag,
} from "react-icons/hi2";

export const SUPERADMIN_NAV = [
  { to: "/dashboard/superadmin", label: "Platform Overview", icon: HiOutlineGlobeAlt, end: true },
  { to: "/dashboard/superadmin", label: "Tenants", icon: HiOutlineBuildingOffice2 },
  { to: "/dashboard/superadmin", label: "Sub-Superadmins", icon: HiOutlineUserGroup },
  { to: "/dashboard/superadmin/category", label: "Add Category", icon: HiOutlineTag },
  { to: "/dashboard/superadmin/questions", label: "Global Question Bank", icon: HiOutlineDocumentMagnifyingGlass },
  { to: "/dashboard/superadmin/instructions", label: "Exam Instructions", icon: HiOutlineChatBubbleBottomCenterText },
  { to: "/exam-price", label: "Packages & Pricing", icon: HiOutlineBanknotes },
  { to: "/dashboard/superadmin", label: "Audit & Security", icon: HiOutlineShieldCheck },
];

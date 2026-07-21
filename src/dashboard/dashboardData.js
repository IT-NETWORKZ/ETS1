// ---- Candidate Dashboard (PRD 7.1) ----
export const candidateUpcoming = [
  { id: 1, title: "Quantitative Aptitude — Scheduled Exam", type: "Scheduled Normal", date: "15 Jul, 10:00 AM", duration: "45 min" },
  { id: 2, title: "Employee Engagement Survey", type: "Survey", date: "16 Jul, Anytime", duration: "8 questions" },
  { id: 3, title: "Verbal Ability — Proctored Exam", type: "Scheduled Proctored", date: "20 Jul, 2:00 PM", duration: "30 min" },
];

export const candidateInterrupted = {
  title: "Logical Reasoning — Custom Practice",
  progress: 6,
  total: 10,
  lastActive: "2 hours ago",
};

export const candidateResultsAwaiting = [
  { id: 1, title: "Quantitative Aptitude — Practice", status: "Descriptive Evaluation Pending" },
  { id: 2, title: "Organization Onboarding Exam", status: "Held — Scheduled Release 18 Jul" },
];

export const candidateCertificates = [
  { id: 1, title: "Verbal Ability — Professional Level", date: "02 Jul 2026", verified: true },
  { id: 2, title: "Quantitative Aptitude — Master Level", date: "18 Jun 2026", verified: true },
];

export const candidatePerformance = [
  { month: "Feb", score: 62 },
  { month: "Mar", score: 68 },
  { month: "Apr", score: 71 },
  { month: "May", score: 75 },
  { month: "Jun", score: 79 },
  { month: "Jul", score: 84 },
];

export const candidateTopicMastery = [
  { topic: "Quant", accuracy: 82 },
  { topic: "Verbal", accuracy: 74 },
  { topic: "Reasoning", accuracy: 68 },
  { topic: "General Awareness", accuracy: 58 },
];

export const candidateNotifications = [
  { id: 1, text: "Your certificate for Verbal Ability has been issued.", time: "1h ago", tone: "success" },
  { id: 2, text: "Reminder: Verbal Ability proctored exam starts 20 Jul, 2:00 PM.", time: "5h ago", tone: "info" },
  { id: 3, text: "Practice subscription renews in 6 days.", time: "1d ago", tone: "warning" },
];

// ---- Organization Admin Dashboard (PRD 8.1) ----
export const adminQuota = [
  { label: "Candidate Attempts", used: 3120, total: 5000, color: "var(--leaf-500)" },
  { label: "Proctoring Minutes", used: 8400, total: 12000, color: "var(--teal-400)", unit: "min" },
  { label: "AI Credits", used: 640, total: 1000, color: "var(--amber-500)" },
  { label: "WhatsApp Quota", used: 2100, total: 3000, color: "#2f7dd1" },
];

export const adminExamStatus = [
  { status: "Upcoming", count: 6, tone: "info" },
  { status: "Live", count: 2, tone: "danger" },
  { status: "Completed", count: 34, tone: "success" },
  { status: "Draft", count: 4, tone: "neutral" },
];

export const adminSurveys = [
  { id: 1, title: "New Joiner Feedback", responses: 142, target: 180, closes: "22 Jul" },
  { id: 2, title: "Manager Effectiveness Pulse", responses: 88, target: 120, closes: "25 Jul" },
];

export const adminDescriptivePending = [
  { id: 1, candidate: "Rohit Sharma", exam: "Case Study — Business Analysis", submitted: "12 Jul, 4:10 PM" },
  { id: 2, candidate: "Sneha Deshmukh", exam: "Written Communication Assessment", submitted: "12 Jul, 3:40 PM" },
  { id: 3, candidate: "Karan Mehta", exam: "Case Study — Business Analysis", submitted: "11 Jul, 6:05 PM" },
];

export const adminProctorIncidents = [
  { id: 1, candidate: "Aditya Kulkarni", exam: "Verbal Ability — Proctored", alert: "Tab switch detected", severity: "warning" },
  { id: 2, candidate: "Priya Nair", exam: "Logical Reasoning — Proctored", alert: "Multiple faces detected", severity: "danger" },
  { id: 3, candidate: "Karan Mehta", exam: "Quantitative Aptitude — Proctored", alert: "Camera blocked briefly", severity: "warning" },
];

export const adminResultQueue = [
  { id: 1, exam: "Onboarding Assessment — Batch 4", candidates: 48, status: "Awaiting Approval" },
  { id: 2, exam: "Sales Team Certification", candidates: 22, status: "Certificate Queue" },
  { id: 3, exam: "Quarterly Compliance Test", candidates: 96, status: "Communication Sent" },
];

export const adminCandidateGroups = [
  { id: 1, name: "Batch 2026 — Engineering", count: 210 },
  { id: 2, name: "Sales Team North", count: 64 },
  { id: 3, name: "New Joiners — Jul 2026", count: 38 },
];

// ---- Superadmin Dashboard (PRD 10.1 / 19) ----
export const platformStats = [
  { label: "Active Tenants", value: "294" },
  { label: "Total Candidates", value: "5,594" },
  { label: "Live Exams Now", value: "18" },
  { label: "Monthly Revenue", value: "₹18.4L" },
];

export const tenantUsage = [
  { id: 1, tenant: "IT-NetworkZ Infosystems", plan: "Master", candidates: 1240, usage: 82 },
  { id: 2, tenant: "Kavin SA Pty Ltd", plan: "Expert", candidates: 960, usage: 74 },
  { id: 3, tenant: "Nagpur Institute of Technology", plan: "Professional", candidates: 540, usage: 91 },
  { id: 4, tenant: "Prime Coaching Centre", plan: "Master", candidates: 480, usage: 63 },
  { id: 5, tenant: "Bright Scholars Academy", plan: "Intern", candidates: 120, usage: 45 },
];

export const packageDistribution = [
  { name: "Intern", value: 96, color: "#8592ab" },
  { name: "Professional", value: 78, color: "#2f7dd1" },
  { name: "Master", value: 64, color: "var(--leaf-500)" },
  { name: "Expert", value: 38, color: "var(--amber-500)" },
  { name: "Chief", value: 18, color: "#c0392b" },
];

export const aiUsageTrend = [
  { month: "Feb", credits: 4200 },
  { month: "Mar", credits: 5100 },
  { month: "Apr", credits: 6300 },
  { month: "May", credits: 7100 },
  { month: "Jun", credits: 8600 },
  { month: "Jul", credits: 9800 },
];

export const systemHealth = [
  { label: "API Latency (p95)", value: "212ms", tone: "success" },
  { label: "Exam Delivery Uptime", value: "99.98%", tone: "success" },
  { label: "Proctoring Stream Load", value: "Moderate", tone: "warning" },
  { label: "Queue Backlog", value: "0 jobs", tone: "success" },
];

export const auditLog = [
  { id: 1, actor: "Superadmin — R. Kulkarni", action: "Approved global question publication", time: "10 min ago" },
  { id: 2, actor: "Sub-Superadmin — A. Nair", action: "Updated coupon code EDU2026", time: "42 min ago" },
  { id: 3, actor: "System", action: "Auto-flagged AI-generated question for review", time: "1h ago" },
  { id: 4, actor: "Superadmin — R. Kulkarni", action: "Suspended tenant 'TestOrg Demo' for policy violation", time: "3h ago" },
];

export const moderationQueue = [
  { id: 1, item: "MCQ — 'Cloud Computing Basics'", source: "AI-Assisted", flag: "Duplicate suspected" },
  { id: 2, item: "Descriptive — 'Ethics Case Study'", source: "Organization Private", flag: "Submitted for platform publish" },
  { id: 3, item: "MCQ — 'Data Structures: Trees'", source: "AI-Assisted", flag: "Low quality confidence" },
];

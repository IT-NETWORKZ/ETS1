import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineUsers, HiOutlineVideoCamera, HiOutlineDocumentPlus,
  HiOutlinePlusCircle, HiOutlineUserPlus, HiOutlineChatBubbleLeftRight, HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import DashboardLayout from "../../../dashboard/DashboardLayout";
import SectionCard from "../../../dashboard/widgets/SectionCard";
import DataTable from "../../../dashboard/widgets/DataTable";
import OpsKanban from "../../../dashboard/widgets/OpsKanban";
import Gauge from "../../../dashboard/widgets/Gauge";
import { Badge } from "../../../dashboard/widgets/Misc";
import { ADMIN_NAV } from "./adminNav";
import {
  adminQuota, adminExamStatus, adminSurveys, adminDescriptivePending,
  adminProctorIncidents, adminResultQueue, adminCandidateGroups,
} from "../../../dashboard/dashboardData";
import "../../../dashboard/DashboardShared.css";
import "./AdminDashboard.css";

const SEVERITY_TONE = { warning: "warning", danger: "danger" };

export default function AdminDashboard() {
  return (
    <DashboardLayout
      role="admin"
      roleLabel="Organisation Admin"
      roleColor="#2f7dd1"
      navItems={ADMIN_NAV}
      userName="IT-NetworkZ Admin"
      userMeta="Master Plan · Nagpur, India"
    >
      <motion.div className="adminhero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div>
          <h1 className="dashpage__heading">Organisation Overview</h1>
          <p className="dashpage__subheading">Exams, surveys, candidates and proctoring — all in one place.</p>
        </div>
        {adminExamStatus.find((s) => s.status === "Live")?.count > 0 && (
          <span className="adminhero__live">
            <span className="adminhero__livedot" />
            {adminExamStatus.find((s) => s.status === "Live").count} exam(s) live now
          </span>
        )}
      </motion.div>

      <OpsKanban items={adminExamStatus} />

      <div className="adminquickactions">
        <Link to="/demo-exam" className="quickaction">
          <HiOutlinePlusCircle /> Create Exam
        </Link>
        <Link to="/dashboard/admin/questions" className="quickaction">
          <HiOutlineDocumentPlus /> Add Questions
        </Link>
        <Link to="/register" className="quickaction">
          <HiOutlineUserPlus /> Add Candidates
        </Link>
        <Link to="/tech-support" className="quickaction quickaction--ghost">
          <HiOutlineChatBubbleLeftRight /> Contact Support
        </Link>
      </div>

      <div className="dashpage__grid">
        <SectionCard title="Subscription & Quota Balance" subtitle="Master Plan · Renews 24 Nov 2026" delay={0.1} className="dashpage__span2">
          <div className="quotagauges">
            {adminQuota.map((q, i) => (
              <div className="quotagauges__item" key={q.label}>
                <Gauge
                  value={(q.used / q.total) * 100}
                  size={78}
                  stroke={8}
                  color={q.color}
                  delay={i * 0.08}
                />
                <div className="quotagauges__text">
                  <div className="quotagauges__label">{q.label}</div>
                  <div className="quotagauges__count">{q.used.toLocaleString()} / {q.total.toLocaleString()} {q.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Active Surveys" subtitle="Response rate vs target" delay={0.15}>
          <div className="surveylist">
            {adminSurveys.map((s) => (
              <div className="surveyitem" key={s.id}>
                <div className="surveyitem__head">
                  <span>{s.title}</span>
                  <span>{s.responses}/{s.target}</span>
                </div>
                <div className="surveyitem__track">
                  <div className="surveyitem__fill" style={{ width: `${Math.min(100, (s.responses / s.target) * 100)}%` }} />
                </div>
                <div className="surveyitem__meta">Closes {s.closes}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Candidate Groups" subtitle={`${adminCandidateGroups.reduce((a, g) => a + g.count, 0)} candidates total`} delay={0.2}>
          <div className="grouplist">
            {adminCandidateGroups.map((g) => (
              <div className="groupitem" key={g.id}>
                <HiOutlineUsers />
                <span className="groupitem__name">{g.name}</span>
                <span className="groupitem__count">{g.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Pending Descriptive Evaluations" subtitle="Manual review required" delay={0.25} className="dashpage__span2">
          <DataTable
            columns={[
              { key: "candidate", label: "Candidate" },
              { key: "exam", label: "Exam" },
              { key: "submitted", label: "Submitted" },
              { key: "action", label: "", render: () => <button className="tablebtn">Evaluate</button> },
            ]}
            rows={adminDescriptivePending}
          />
        </SectionCard>

        <SectionCard title="Proctor Assignments & Incidents" subtitle="Live monitoring alerts" delay={0.3} className="dashpage__span2">
          <div className="incidentlist">
            {adminProctorIncidents.map((inc) => (
              <div className={"incidentitem" + (inc.severity === "danger" ? " incidentitem--danger" : "")} key={inc.id}>
                <HiOutlineVideoCamera className="incidentitem__icon" />
                <div className="incidentitem__body">
                  <div className="incidentitem__title">{inc.candidate} — {inc.exam}</div>
                  <div className="incidentitem__alert"><HiOutlineExclamationTriangle /> {inc.alert}</div>
                </div>
                <Badge tone={SEVERITY_TONE[inc.severity]}>{inc.severity}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Result Approvals & Certificate Queue" subtitle="Communication status" delay={0.35} className="dashpage__span2">
          <DataTable
            columns={[
              { key: "exam", label: "Exam" },
              { key: "candidates", label: "Candidates" },
              { key: "status", label: "Status", render: (r) => (
                  <Badge tone={r.status.includes("Approval") ? "warning" : r.status.includes("Queue") ? "info" : "success"}>{r.status}</Badge>
                ) },
            ]}
            rows={adminResultQueue}
          />
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

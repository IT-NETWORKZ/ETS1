import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  HiOutlineCalendarDays, HiOutlineDocumentText, HiOutlineAcademicCap,
  HiOutlineClock, HiOutlineArrowRight, HiOutlineSparkles, HiOutlineBellAlert,
} from "react-icons/hi2";
import DashboardLayout from "../../../dashboard/DashboardLayout";
import StatCard from "../../../dashboard/widgets/StatCard";
import SectionCard from "../../../dashboard/widgets/SectionCard";
import Gauge from "../../../dashboard/widgets/Gauge";
import JourneyRail from "../../../dashboard/widgets/JourneyRail";
import { Badge, EmptyState } from "../../../dashboard/widgets/Misc";
import { CANDIDATE_NAV } from "./candidateNav";
import {
  candidateUpcoming, candidateInterrupted, candidateResultsAwaiting,
  candidateCertificates, candidatePerformance, candidateTopicMastery, candidateNotifications,
} from "../../../dashboard/dashboardData";
import "../../../dashboard/DashboardShared.css";
import "./CandidateDashboard.css";

export default function CandidateDashboard() {
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
        className="candidatehero"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="candidatehero__top">
          <div>
            <h1 className="candidatehero__heading">Welcome back, Amrapali</h1>
            <p className="candidatehero__subheading">Here's where your practice and scheduled exams stand today.</p>
          </div>
        </div>
        <JourneyRail activeKey="exam" />
      </motion.div>

      {candidateInterrupted && (
        <motion.div
          className="resumecard"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="resumecard__icon"><HiOutlineClock /></div>
          <div className="resumecard__body">
            <div className="resumecard__title">Continue interrupted session</div>
            <div className="resumecard__meta">
              {candidateInterrupted.title} · Question {candidateInterrupted.progress} of {candidateInterrupted.total} · last active {candidateInterrupted.lastActive}
            </div>
          </div>
          <Link to="/demo-exam" className="resumecard__btn">Resume <HiOutlineArrowRight /></Link>
        </motion.div>
      )}

      <div className="dashpage__stats">
        <StatCard icon={HiOutlineCalendarDays} label="Upcoming Exams & Surveys" value={candidateUpcoming.length} accent="var(--teal-400)" delay={0} />
        <StatCard icon={HiOutlineDocumentText} label="Results Awaiting Release" value={candidateResultsAwaiting.length} accent="var(--amber-500)" delay={0.05} />
        <StatCard icon={HiOutlineAcademicCap} label="Certificates Earned" value={candidateCertificates.length} accent="var(--leaf-500)" delay={0.1} />
        <motion.div
          className="statcard scoregauge"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: 0.15 }}
          whileHover={{ y: -4 }}
        >
          <Gauge value={76} size={64} stroke={7} color="#2f7dd1" delay={0.15} />
          <div className="scoregauge__text">
            <span className="scoregauge__label">Average Score (6 mo)</span>
            <span className="scoregauge__sub">+14% since Feb</span>
          </div>
        </motion.div>
      </div>

      <div className="dashpage__grid">
        <SectionCard
          title="Upcoming Exams & Surveys"
          subtitle="Assigned by your organisation or scheduled by you"
          delay={0.1}
          className="dashpage__span2"
        >
          <div className="upcominglist">
            {candidateUpcoming.map((u) => (
              <div className="upcomingitem" key={u.id}>
                <div>
                  <div className="upcomingitem__title">{u.title}</div>
                  <div className="upcomingitem__meta">{u.type} · {u.duration}</div>
                </div>
                <div className="upcomingitem__date">{u.date}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Practice Exam Builder" subtitle="Build a custom set in seconds" delay={0.15}>
          <div className="buildercard">
            <HiOutlineSparkles className="buildercard__icon" />
            <p>Choose subject, difficulty, question count and duration — start practicing right away.</p>
            <Link to="/demo-exam" className="buildercard__btn">Start Practice Exam</Link>
          </div>
        </SectionCard>

        <SectionCard title="Performance Trend" subtitle="Average score over the last 6 months" delay={0.2} className="dashpage__span2">
          <div className="perfchart">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={candidatePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--ink-400)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--ink-400)" }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", fontSize: 12.5 }} />
                <Line type="monotone" dataKey="score" stroke="var(--leaf-500)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Strengths & Improvement Areas" subtitle="Topic-wise accuracy" delay={0.25}>
          <div className="topiclist">
            {candidateTopicMastery.map((t) => (
              <div className="topicitem" key={t.topic}>
                <div className="topicitem__head">
                  <span>{t.topic}</span>
                  <span>{t.accuracy}%</span>
                </div>
                <div className="topicitem__track">
                  <div
                    className="topicitem__fill"
                    style={{
                      width: `${t.accuracy}%`,
                      background: t.accuracy >= 75 ? "var(--leaf-500)" : t.accuracy >= 60 ? "var(--amber-500)" : "#d9534f",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Results Awaiting Release" delay={0.3}>
          {candidateResultsAwaiting.length ? (
            <div className="resultlist">
              {candidateResultsAwaiting.map((r) => (
                <div className="resultitem" key={r.id}>
                  <span>{r.title}</span>
                  <Badge tone="warning">{r.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={HiOutlineDocumentText} text="No results pending release." />
          )}
        </SectionCard>

        <SectionCard title="Certificates" subtitle="Earned from organisation-scheduled exams" delay={0.35}>
          <div className="certlist">
            {candidateCertificates.map((c) => (
              <div className="certflip" key={c.id} tabIndex={0}>
                <div className="certflip__inner">
                  <div className="certflip__face certflip__face--front">
                    <HiOutlineAcademicCap className="certitem__icon" />
                    <div>
                      <div className="certitem__title">{c.title}</div>
                      <div className="certitem__meta">Issued {c.date} {c.verified && "· Verified"}</div>
                    </div>
                  </div>
                  <div className="certflip__face certflip__face--back">
                    <span>Verification ID</span>
                    <strong>EXAM-{2600 + c.id * 37}-IN</strong>
                    <em>Hover to view · click to open ↗</em>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notifications" delay={0.4}>
          <div className="notiflist">
            {candidateNotifications.map((n) => (
              <div className="notifitem" key={n.id}>
                <HiOutlineBellAlert className={"notifitem__icon notifitem__icon--" + n.tone} />
                <div>
                  <div className="notifitem__text">{n.text}</div>
                  <div className="notifitem__time">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

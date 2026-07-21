import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  HiOutlineBuildingOffice2, HiOutlineUserGroup, HiOutlineBanknotes,
  HiOutlineCpuChip, HiOutlineDocumentMagnifyingGlass, HiOutlineSignal,
} from "react-icons/hi2";
import DashboardLayout from "../../../dashboard/DashboardLayout";
import StatCard from "../../../dashboard/widgets/StatCard";
import SectionCard from "../../../dashboard/widgets/SectionCard";
import DataTable from "../../../dashboard/widgets/DataTable";
import AuditTicker from "../../../dashboard/widgets/AuditTicker";
import { Badge } from "../../../dashboard/widgets/Misc";
import { SUPERADMIN_NAV } from "./superadminNav";
import {
  platformStats, tenantUsage, packageDistribution, aiUsageTrend,
  systemHealth, auditLog, moderationQueue,
} from "../../../dashboard/dashboardData";
import "../../../dashboard/DashboardShared.css";
import "./SuperadminDashboard.css";

const STAT_ICONS = [HiOutlineBuildingOffice2, HiOutlineUserGroup, HiOutlineSignal, HiOutlineBanknotes];
const STAT_COLORS = ["var(--teal-400)", "var(--leaf-500)", "#d9534f", "var(--amber-500)"];

export default function SuperadminDashboard() {
  return (
    <DashboardLayout
      role="superadmin"
      roleLabel="Superadmin Console"
      roleColor="#7c5cff"
      navItems={SUPERADMIN_NAV}
      userName="R. Kulkarni"
      userMeta="Superadmin · Full Access"
    >
      <div className="supconsole">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="dashpage__heading supconsole__heading">Platform Governance</h1>
        <p className="dashpage__subheading supconsole__subheading">Tenants, packages, AI usage, content moderation and platform health.</p>
      </motion.div>

      <div className="dashpage__stats">
        {platformStats.map((s, i) => (
          <StatCard key={s.label} icon={STAT_ICONS[i]} label={s.label} value={s.value} accent={STAT_COLORS[i]} delay={i * 0.05} />
        ))}
      </div>

      <AuditTicker items={auditLog} />

      <div className="dashpage__grid">
        <SectionCard title="Tenant Usage" subtitle="Top organisations by activity" delay={0.1} className="dashpage__span2">
          <DataTable
            columns={[
              { key: "tenant", label: "Tenant" },
              { key: "plan", label: "Plan", render: (r) => <Badge tone={r.plan === "Expert" || r.plan === "Chief" ? "warning" : "info"}>{r.plan}</Badge> },
              { key: "candidates", label: "Candidates" },
              { key: "usage", label: "Quota Used", render: (r) => (
                  <div className="usagecell">
                    <div className="usagecell__track"><div className="usagecell__fill" style={{ width: `${r.usage}%` }} /></div>
                    <span>{r.usage}%</span>
                  </div>
                ) },
            ]}
            rows={tenantUsage}
          />
        </SectionCard>

        <SectionCard title="Package Distribution" subtitle="Tenants by subscription tier" delay={0.15}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={packageDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {packageDistribution.map((p) => <Cell key={p.name} fill={p.color} />)}
              </Pie>
              <Legend verticalAlign="bottom" height={36} iconSize={9} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", fontSize: 12.5 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="AI Credit Usage Trend" subtitle="Platform-wide AI-assisted question generation" delay={0.2} className="dashpage__span2">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aiUsageTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--ink-400)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--ink-400)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", fontSize: 12.5 }} />
              <Line type="monotone" dataKey="credits" stroke="#7c5cff" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="System Health" subtitle="Live platform status" delay={0.25}>
          <div className="healthlist">
            {systemHealth.map((h) => (
              <div className="healthitem" key={h.label}>
                <span className="healthitem__label">
                  <span className={"healthitem__pulse healthitem__pulse--" + h.tone} />
                  {h.label}
                </span>
                <Badge tone={h.tone}>{h.value}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Content Moderation Queue" subtitle="AI-generated & tenant-submitted content" delay={0.3} className="dashpage__span2">
          <div className="modqueue">
            {moderationQueue.map((m) => (
              <div className="modqueue__item" key={m.id}>
                <HiOutlineDocumentMagnifyingGlass className="modqueue__icon" />
                <div className="modqueue__body">
                  <div className="modqueue__title">{m.item}</div>
                  <div className="modqueue__meta">{m.source}</div>
                </div>
                <Badge tone="warning">{m.flag}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Audit Log" subtitle="Recent critical actions" delay={0.35} className="dashpage__span2">
          <div className="auditlist">
            {auditLog.map((a) => (
              <div className="audititem" key={a.id}>
                <HiOutlineCpuChip className="audititem__icon" />
                <div className="audititem__body">
                  <div className="audititem__action">{a.action}</div>
                  <div className="audititem__meta">{a.actor} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      </div>
    </DashboardLayout>
  );
}

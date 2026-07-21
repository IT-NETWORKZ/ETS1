import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCamera, HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone,
  HiOutlineCalendarDays, HiOutlineIdentification, HiOutlineMapPin, HiOutlineHome,
  HiOutlineCheckCircle, HiOutlineAcademicCap, HiOutlineDocumentText,
  HiOutlineShieldCheck, HiOutlineTicket,
} from "react-icons/hi2";
import DashboardLayout from "../../../../dashboard/DashboardLayout";
import SectionCard from "../../../../dashboard/widgets/SectionCard";
import StatCard from "../../../../dashboard/widgets/StatCard";
import { Badge } from "../../../../dashboard/widgets/Misc";
import { CANDIDATE_NAV } from "../candidateNav";
import { candidateCertificates, candidateResultsAwaiting } from "../../../../dashboard/dashboardData";
import "../../../../dashboard/DashboardShared.css";
import "./CandidateProfile.css";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

const INITIAL_PROFILE = {
  firstName: "Amrapali",
  lastName: "Ambade",
  email: "amrapali.ambade@example.com",
  phone: "+91 98765 43210",
  dob: "1999-04-12",
  gender: "Female",
  city: "Nagpur",
  address: "204, Shivaji Nagar, Nagpur, Maharashtra - 440010",
};

const FIELDS = [
  { key: "firstName", label: "First Name", icon: HiOutlineUser, placeholder: "First Name" },
  { key: "lastName", label: "Last Name", icon: HiOutlineUser, placeholder: "Last Name" },
  { key: "email", label: "Email Id", icon: HiOutlineEnvelope, type: "email", placeholder: "you@example.com" },
  { key: "phone", label: "Phone", icon: HiOutlinePhone, type: "tel", placeholder: "+91 98765 43210" },
  { key: "dob", label: "Date of Birth", icon: HiOutlineCalendarDays, type: "date" },
  { key: "gender", label: "Gender", icon: HiOutlineIdentification, type: "select", options: GENDER_OPTIONS },
  { key: "city", label: "City", icon: HiOutlineMapPin, placeholder: "City" },
  { key: "address", label: "Address", icon: HiOutlineHome, type: "textarea", placeholder: "Full address", full: true },
];

export default function CandidateProfile() {
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [saved, setSaved] = useState(false);

  const fullName = `${draft.firstName} ${draft.lastName}`.trim();
  const initials = (profile.firstName?.[0] || "") + (profile.lastName?.[0] || "");

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSave(e) {
    e.preventDefault();
    setProfile(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <DashboardLayout
      role="candidate"
      roleLabel="Candidate Dashboard"
      roleColor="var(--leaf-500)"
      navItems={CANDIDATE_NAV}
      userName={`${profile.firstName} ${profile.lastName}`.trim()}
      userMeta="Candidate · Master Plan"
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="dashpage__heading">My Profile</h1>
        <p className="dashpage__subheading">Your photo, personal details and account summary.</p>
      </motion.div>

      {/* ---- Profile header: photo + identity + quick facts ---- */}
      <SectionCard delay={0.05}>
        <div className="profilehead">
          <div className="profilehead__photo">
            <div className="profilehead__avatar">
              {photo ? (
                <img src={photo} alt="Profile" />
              ) : (
                <span>{initials || "U"}</span>
              )}
            </div>
            <button type="button" className="profilehead__camera" onClick={() => fileRef.current?.click()}>
              <HiOutlineCamera />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </div>

          <div className="profilehead__info">
            <div className="profilehead__name">{fullName || "Candidate"}</div>
            <div className="profilehead__meta">{profile.email} · {profile.phone}</div>
            <div className="profilehead__tags">
              <Badge tone="success">Master Plan</Badge>
              <Badge tone="info">Candidate ID: EXAM-CD-10482</Badge>
              <Badge tone="neutral">Member since Feb 2026</Badge>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ---- Quick stats ---- */}
      <div className="dashpage__stats">
        <StatCard icon={HiOutlineAcademicCap} label="Certificates Earned" value={candidateCertificates.length} accent="var(--leaf-500)" delay={0.1} />
        <StatCard icon={HiOutlineDocumentText} label="Results Awaiting" value={candidateResultsAwaiting.length} accent="var(--amber-500)" delay={0.15} />
        <StatCard icon={HiOutlineShieldCheck} label="Proctored Exams Cleared" value={4} accent="#2f7dd1" delay={0.2} />
        <StatCard icon={HiOutlineTicket} label="Active Subscription" value="Master" accent="#7c5cff" delay={0.25} />
      </div>

      {/* ---- Editable personal details ---- */}
      <SectionCard title="Personal Details" subtitle="Keep this information accurate — it appears on your certificates" delay={0.3}>
        <form className="profileform" onSubmit={handleSave}>
          <div className="profileform__grid">
            {FIELDS.map((f) => (
              <label key={f.key} className={"pfield" + (f.full ? " pfield--full" : "")}>
                <span className="pfield__label"><f.icon /> {f.label}</span>
                {f.type === "select" ? (
                  <select value={draft[f.key]} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}>
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    rows={2}
                    placeholder={f.placeholder}
                    value={draft[f.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    value={draft[f.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="profileform__footer">
            <button type="submit" className="profileform__save">Save Changes</button>
            <AnimatePresence>
              {saved && (
                <motion.span
                  className="profileform__savedtag"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                >
                  <HiOutlineCheckCircle /> Profile updated
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>
      </SectionCard>
    </DashboardLayout>
  );
}

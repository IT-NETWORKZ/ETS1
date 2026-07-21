import { useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser, HiOutlineLockClosed, HiOutlineEnvelope, HiOutlinePhone,
  HiOutlineBuildingOffice2, HiOutlineCheckCircle, HiOutlineCalendarDays,
  HiOutlineMapPin, HiOutlineHome, HiOutlineIdentification,
} from "react-icons/hi2";
import PageHero from "../components/PageHero";
import Captcha from "../components/Captcha";
import "./Register.css";
import { registerCandidate, registerAdmin } from "../api/authApi";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

const CANDIDATE_FIELDS = [
  { key: "firstName", label: "First Name", placeholder: "Enter First Name", icon: HiOutlineUser },
  { key: "lastName", label: "Last Name", placeholder: "Enter Last Name", icon: HiOutlineUser },
  { key: "email", label: "Email Id", placeholder: "Enter Your Email Id", icon: HiOutlineEnvelope, type: "email" },
  { key: "phone", label: "Phone", placeholder: "Enter Phone Number", icon: HiOutlinePhone, type: "tel" },
  { key: "password", label: "Password", placeholder: "Create a password", icon: HiOutlineLockClosed, type: "password" },
  { key: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter your password", icon: HiOutlineLockClosed, type: "password" },
  { key: "dob", label: "Date of Birth", icon: HiOutlineCalendarDays, type: "date" },
  { key: "gender", label: "Gender", icon: HiOutlineIdentification, type: "select", options: GENDER_OPTIONS },
  { key: "city", label: "City", placeholder: "Enter Your City", icon: HiOutlineMapPin },
  { key: "address", label: "Address", placeholder: "Enter Your Address", icon: HiOutlineHome, type: "textarea", full: true },
];

const ADMIN_FIELDS = [
  { key: "orgName", label: "Organisation Name", placeholder: "Enter Organisation / Institution Name", icon: HiOutlineBuildingOffice2, full: true },
  { key: "city", label: "City", placeholder: "Enter Your City", icon: HiOutlineMapPin },
  { key: "firstName", label: "First Name", placeholder: "Enter First Name", icon: HiOutlineUser },
  { key: "lastName", label: "Last Name", placeholder: "Enter Last Name", icon: HiOutlineUser },
  { key: "email", label: "Email Id", placeholder: "Enter Your Email Id", icon: HiOutlineEnvelope, type: "email" },
  { key: "phone", label: "Phone", placeholder: "Enter Phone Number", icon: HiOutlinePhone, type: "tel" },
  { key: "password", label: "Password", placeholder: "Create a password", icon: HiOutlineLockClosed, type: "password" },
  { key: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter your password", icon: HiOutlineLockClosed, type: "password" },
  { key: "dob", label: "Date of Birth", icon: HiOutlineCalendarDays, type: "date" },
  { key: "gender", label: "Gender", icon: HiOutlineIdentification, type: "select", options: GENDER_OPTIONS },
];

const TAB_CONFIG = {
  candidate: {
    heroTitle: "Candidate Registration",
    tabLabel: "Candidate Registration",
    fields: CANDIDATE_FIELDS,
    intro: "Create a candidate account to take practice exams and track your results.",
    successTitle: "Candidate account created",
    submitLabel: "Create Candidate Account",
    asideTitle: "Why register as a candidate?",
    benefits: [
      "Practice exams across 2900+ subjects",
      "Track your history and scores in one dashboard",
      "Renew subscription anytime — Beginner, Master, or Expert",
    ],
  },
  admin: {
    heroTitle: "Admin Registration",
    tabLabel: "Admin Registration",
    fields: ADMIN_FIELDS,
    intro: "Register your organisation to schedule exams and manage candidates.",
    successTitle: "Admin account created",
    submitLabel: "Create Admin Account",
    asideTitle: "Why register as an admin?",
    benefits: [
      "Schedule exams for any number of participants",
      "Upload your own question bank or use ready-made sets",
      "Access participant history and certificates",
    ],
  },
};



function Field({ f, value, onChange }) {
  const commonProps = {
    required: true,
    value: value || "",
    onChange: (e) => onChange(f.key, e.target.value),
  };

  return (
    <div className={"registercard__field" + (f.full ? " registercard__field--full" : "")}>
      <label><f.icon /> {f.label}</label>
      {f.type === "select" ? (
        <select {...commonProps}>
          <option value="">Select {f.label}</option>
          {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : f.type === "textarea" ? (
        <textarea rows={3} placeholder={f.placeholder} {...commonProps} />
      ) : (
        <input type={f.type || "text"} placeholder={f.placeholder} {...commonProps} />
      )}
    </div>
  );
}

export default function Register() {
  const [params] = useSearchParams();
  const requestedTab = params.get("type");
  const initialTab = TAB_CONFIG[requestedTab] ? requestedTab : "candidate";
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({});
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  const config = TAB_CONFIG[tab];

  const [loading, setLoading] = useState(false);
const [apiError, setApiError] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function switchTab(next) {
    setTab(next);
    setForm({});
    setAgree(false);
    setCaptchaError(false);
    captchaRef.current?.reset();
  }

async function submit(e) {
  e.preventDefault();
  setApiError("");

  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    alert("Password and Confirm Password do not match.");
    return;
  }

  const captchaOk = captchaRef.current?.verify();
  if (!captchaOk) {
    setCaptchaError(true);
    return;
  }
  setCaptchaError(false);
  setLoading(true);

  try {
    let response;

    if (tab === "candidate") {
      const payload = {
        sFName: form.firstName,
        sLName: form.lastName,
        sEmail: form.email,
        sMobile: form.phone,
        sPassword: form.password,
        sCPassword: form.confirmPassword,
        Dob: form.dob || null,
        sGender: form.gender,
        sCity: form.city,
        sAddress: form.address,
      };
      console.log("Submitting CANDIDATE payload:", payload);
      response = await registerCandidate(payload);
    } else {
      const payload = {
        sOrgName: form.orgName,
        sFName: form.firstName,
        sLName: form.lastName,
        sEmail: form.email,
        sMobile: form.phone,
        sPassword: form.password,
        sCPassword: form.confirmPassword,
        Dob: form.dob || null,
        sGender: form.gender,
        sCity: form.city,
      };
      console.log("Submitting ADMIN payload:", payload);
      response = await registerAdmin(payload);
    }

    console.log("Registration SUCCESS response:", {
      status: response.status,
      data: response.data,
    });

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
console.error("STATUS:", err.response?.status);
console.error("ERROR DATA:", JSON.stringify(err.response?.data, null, 2));
console.error("URL:", err.config?.url);

    if (err.response) {
      setApiError(
        err.response.data?.Message ||
        err.response.data?.message ||
        (typeof err.response.data === "string" ? err.response.data : "") ||
        "Registration failed."
      );
    } else {
      setApiError("Unable to connect to the server.");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div>
      <PageHero title={config.heroTitle} />

      <section className="register">
        <div className="container register__wrap">
          <motion.div
            className="registercard"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="registercard__tabs">
              {Object.keys(TAB_CONFIG).map((key) => (
                <button
                  key={key}
                  className={"registercard__tab" + (tab === key ? " registercard__tab--active" : "")}
                  onClick={() => switchTab(key)}
                >
                  {TAB_CONFIG[key].tabLabel}
                </button>
              ))}
            </div>

            <div className="registercard__body">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    className="registercard__success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35 }}
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                      className="registercard__success-icon"
                    >
                      <HiOutlineCheckCircle />
                    </motion.div>
                    <h3>{config.successTitle}</h3>
                    <p>
                      A verification link has been sent to <strong>{form.email || "your email"}</strong>.
                      Confirm it to activate your {tab} dashboard.
                    </p>
                    <div className="registercard__success-actions">
                      <button className="registercard__ghost" onClick={() => { setSubmitted(false); setForm({}); captchaRef.current?.reset(); }}>
                        Register another
                      </button>
                      {/* <button className="registercard__primary" onClick={() => navigate("/")}>
                        Go to Login
                      </button> */}

                      <button className="registercard__primary" onClick={() => navigate(tab === "admin" ? "/?type=admin" : "/")}>
  Go to Login
</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key={tab}
                    onSubmit={submit}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="registercard__intro">{config.intro}</p>

                    <div className="registercard__grid">
                      {config.fields.map((f) => (
                        <Field key={f.key} f={f} value={form[f.key]} onChange={update} />
                      ))}
                    </div>

                    <Captcha ref={captchaRef} onValidChange={() => setCaptchaError(false)} />
                    {captchaError && (
                      <motion.p
                        className="registercard__captcha-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        Please answer the security check correctly before continuing.
                      </motion.p>
                    )}

                    <label className="registercard__agree">
                      <input type="checkbox" required checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                      I agree to the Terms & Conditions and Privacy Policy
                    </label>

                    {apiError && (
  <motion.p
    className="registercard__api-error"
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ color: "#d33", marginTop: "8px" }}
  >
    {apiError}
  </motion.p>
)}

                  <motion.button
  type="submit"
  className="registercard__submit"
  whileHover={{ y: -2, boxShadow: "0 12px 26px rgba(245,166,35,0.4)" }}
  whileTap={{ scale: 0.97 }}
  disabled={loading}
>
  {loading ? "Submitting..." : config.submitLabel}
</motion.button>

                    <p className="registercard__switch">
                      Already have an account? <Link to="/">Login instead</Link>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.aside
            className="register__aside"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3>{config.asideTitle}</h3>
            <ul>
              {config.benefits.map((t) => (
                <li key={t}>
                  <HiOutlineCheckCircle /> {t}
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </section>
    </div>
  );
}

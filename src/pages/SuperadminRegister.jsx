import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser, HiOutlineLockClosed, HiOutlineEnvelope, HiOutlinePhone,
  HiOutlineCheckCircle, HiOutlineCalendarDays, HiOutlineIdentification, HiOutlineKey,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import PageHero from "../components/PageHero";
import Captcha from "../components/Captcha";
import "./Register.css";
import "./SuperadminRegister.css";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

const SUPERADMIN_FIELDS = [
  { key: "firstName", label: "First Name", placeholder: "Enter First Name", icon: HiOutlineUser },
  { key: "lastName", label: "Last Name", placeholder: "Enter Last Name", icon: HiOutlineUser },
  { key: "email", label: "Email Id", placeholder: "Enter Your Email Id", icon: HiOutlineEnvelope, type: "email" },
  { key: "phone", label: "Phone", placeholder: "Enter Phone Number", icon: HiOutlinePhone, type: "tel" },
  { key: "password", label: "Password", placeholder: "Create a password", icon: HiOutlineLockClosed, type: "password" },
  { key: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter your password", icon: HiOutlineLockClosed, type: "password" },
  { key: "dob", label: "Date of Birth", icon: HiOutlineCalendarDays, type: "date" },
  { key: "gender", label: "Gender", icon: HiOutlineIdentification, type: "select", options: GENDER_OPTIONS },
  { key: "accessCode", label: "Superadmin Access Code", placeholder: "Enter the platform access code", icon: HiOutlineKey, full: true },
];

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
      ) : (
        <input type={f.type || "text"} placeholder={f.placeholder} {...commonProps} />
      )}
    </div>
  );
}

export default function SuperadminRegister() {
  const [form, setForm] = useState({});
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
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
    setSubmitted(true);
  }

  return (
    <div>
      <PageHero title="Superadmin Registration" />

      <section className="register">
        <div className="container register__wrap">
          <motion.div
            className="registercard superadmincard"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="superadmincard__banner">
              <HiOutlineShieldCheck />
              Restricted registration — requires a valid Superadmin access code
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
                    <h3>Superadmin account created</h3>
                    <p>
                      A verification link has been sent to <strong>{form.email || "your email"}</strong>.
                      Confirm it to activate your Superadmin console access.
                    </p>
                    <div className="registercard__success-actions">
                      <button className="registercard__ghost" onClick={() => { setSubmitted(false); setForm({}); setAgree(false); captchaRef.current?.reset(); }}>
                        Register another
                      </button>
                      <button className="registercard__primary" onClick={() => navigate("/")}>
                        Go to Login
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="registercard__intro">
                      Superadmin accounts govern the whole platform — tenants, packages, global question
                      bank and audit logs. This form is kept separate from Candidate/Admin sign-up and
                      requires an access code issued by an existing Superadmin.
                    </p>

                    <div className="registercard__grid">
                      {SUPERADMIN_FIELDS.map((f) => (
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

                    <motion.button
                      type="submit"
                      className="registercard__submit superadmincard__submit"
                      whileHover={{ y: -2, boxShadow: "0 12px 26px rgba(124,92,255,0.4)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Create Superadmin Account
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
            className="register__aside superadminaside"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3>Why register as a Superadmin?</h3>
            <ul>
              {[
                "Govern every tenant, package and global question bank",
                "Approve or restrict content across the entire platform",
                "Review audit logs, incidents and platform health in one console",
              ].map((t) => (
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

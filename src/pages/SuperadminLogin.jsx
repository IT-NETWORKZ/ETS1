import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser, HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import PageHero from "../components/PageHero";
import Captcha from "../components/Captcha";
import "./Register.css";
import "./SuperadminRegister.css";
import "./SuperadminLogin.css";

export default function SuperadminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const captchaOk = captchaRef.current?.verify();
    if (!captchaOk) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    // TODO: replace with real superadmin auth call
    navigate("/dashboard/superadmin");
  }

  return (
    <div>
      <PageHero title="Superadmin Login" />

      <section className="register">
        <div className="container register__wrap superadminlogin__wrap">
          <motion.div
            className="registercard superadmincard superadminlogin__card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="superadmincard__banner">
              <HiOutlineShieldCheck />
              Restricted access — Superadmin credentials only
            </div>

            <div className="registercard__body">
              <form onSubmit={submit}>
                <p className="registercard__intro">
                  Sign in to the platform-wide Superadmin console. This is a separate,
                  higher-privilege login kept apart from Candidate and Admin sign-in.
                </p>

                <div className="registercard__field">
                  <label><HiOutlineUser /> Email Id</label>
                  <input
                    required
                    type="email"
                    placeholder="Enter Your Email Id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="registercard__field">
                  <label><HiOutlineLockClosed /> Password</label>
                  <input
                    required
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="superadminlogin__row">
                  <label className="registercard__agree superadminlogin__remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Remember Me
                  </label>
                  <a href="#forgot" className="superadminlogin__forgot">Forgot Password?</a>
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

                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="superadminlogin__error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <HiOutlineExclamationTriangle /> {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  className="registercard__submit superadmincard__submit"
                  whileHover={{ y: -2, boxShadow: "0 12px 26px rgba(124,92,255,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Login to Superadmin Console
                </motion.button>

                <p className="registercard__switch">
                  Need a Superadmin account? <Link to="/register/superadmin">Register instead</Link>
                </p>
                <p className="registercard__switch">
                  Not a Superadmin? <Link to="/">Go to Candidate / Admin Login</Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

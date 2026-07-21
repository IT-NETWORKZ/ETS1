// import { useState } from "react";
// import { useSearchParams } from "react-router-dom"; // add this
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate, Link } from "react-router-dom";
// import StatsBar from "../components/StatsBar";
// import HighlightBand from "../components/HighlightBand";
// // import { loginCandidate } from "../api/authApi";
// import { loginCandidate, loginAdmin } from "../api/authApi";
// import { HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
// import "./Home.css";
// import api from "../api/axios";

// const CLIENTS = ["IT-NetworkZ", "Kavin SA", "Nagpur Institute", "Prime Coaching", "Skillup Labs", "Bright Scholars"];

// export default function Home() {
//   const [showPassword, setShowPassword] = useState(false);
//     const [searchParams] = useSearchParams();
//   const requestedTab = searchParams.get("type") === "admin" ? "admin" : "candidate";
//   const [authTab, setAuthTab] = useState(requestedTab);
//   //const [authTab, setAuthTab] = useState("candidate");
//   const [remember, setRemember] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

// function switchTab(tab) {
//   setAuthTab(tab);
//   setEmail("");
//   setPassword("");
//   setError("");
//   setShowPassword(false);
// }

// async function handleLogin() {
//   setError("");
//   setLoading(true);

//   if (!email.trim() || !password.trim()) {
//     setError("Please enter both email and password.");
//     setLoading(false);
//     return;
//   }

//   try {
//     const response =
//       authTab === "candidate"
//         ? await loginCandidate(email.trim(), password.trim())
//         : await loginAdmin(email.trim(), password.trim());

//     if (!response.data) {
//       setError("Invalid login response.");
//       return;
//     }

//     localStorage.setItem("userType", authTab);
//     localStorage.setItem("userData", JSON.stringify(response.data));

//     if (remember) {
//       localStorage.setItem("rememberedEmail", email.trim());
//     }

//     navigate(authTab === "candidate" ? "/dashboard/candidate" : "/dashboard/admin");
//   } catch (err) {
//     console.error("Login Error:", err);

//     if (err.response) {
//       setError(
//         err.response.data?.Message ||
//         err.response.data?.message ||
//         err.response.data ||
//         "Login failed."
//       );
//     } else {
//       setError("Unable to connect to the server.");
//     }
//   } finally {
//     setLoading(false);
//   }
// }
//   return (
//     <div className="home">
//       <div className="home__hero">
//         <motion.div
//           className="home__hero-blob home__hero-blob--1"
//           animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
//           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//         />
//         <motion.div
//           className="home__hero-blob home__hero-blob--2"
//           animate={{ x: [0, -26, 0], y: [0, -18, 0] }}
//           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
//         />
//         <div className="container home__hero-inner">
//           <motion.div
//             className="home__pitch"
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <motion.span
//               className="home__eyebrow"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//             >
//               Online Assessment Platform
//             </motion.span>
//             <h1 className="home__headline">
//               <motion.span
//                 className="home__headline-line"
//                 initial={{ opacity: 0, y: 18 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.55, delay: 0.2 }}
//               >
//                 Test knowledge.
//               </motion.span>
//               <br />
//               <motion.span
//                 className="home__headline-accent"
//                 initial={{ opacity: 0, y: 18 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.55, delay: 0.32 }}
//               >
//                 Prove it, instantly.
//               </motion.span>
//             </h1>
//             <motion.p
//               className="home__sub"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.45 }}
//             >
//               Practice exams, live assessments, and question banks for institutions,
//               organisations, and job seekers — with results the moment you finish.
//             </motion.p>

//             <div className="home__clients-panel">
//               <div className="home__clients-tab">Our Clients</div>
//               <div className="home__clients-track">
//                 <motion.div
//                   className="home__clients-scroll"
//                   animate={{ x: ["0%", "-50%"] }}
//                   transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
//                 >
//                   {[...CLIENTS, ...CLIENTS].map((c, i) => (
//                     <span className="home__client-chip" key={i}>{c}</span>
//                   ))}
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             className="authcard"
//             initial={{ opacity: 0, y: 30, scale: 0.97 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             transition={{ duration: 0.6, delay: 0.15 }}
//           >
//             <div className="authcard__tabs">
//               <button
//                 className={"authcard__tab" + (authTab === "candidate" ? " authcard__tab--active" : "")}
//                 onClick={() => switchTab("candidate")}
//               >
//                 Candidate Login
//               </button>
//               <button
//                 className={"authcard__tab" + (authTab === "admin" ? " authcard__tab--active" : "")}
//                 onClick={() => switchTab("admin")}
//               >
//                 Admin Login
//               </button>
//             </div>

//             <div className="authcard__body">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={authTab}
//                   initial={{ opacity: 0, x: 16 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -16 }}
//                   transition={{ duration: 0.25 }}
//                 >
//                   <a className="authcard__linknote" href="#login">
//                     Login Now ({authTab === "candidate" ? "Candidate Login" : "Admin Login"})
//                   </a>

//                   <label className="authcard__label">
//                     <HiOutlineUser /> Email Id
//                   </label>
//                   <input
//                     className="authcard__input"
//                     placeholder="Enter Your Email Id"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />

//                <label className="authcard__label">
//   <HiOutlineLockClosed /> Password
// </label>
// <div
//   className="authcard__password-wrap"
//   style={{ position: "relative", display: "flex", alignItems: "center" }}
// >
//   <input
//     className="authcard__input"
//     type={showPassword ? "text" : "password"}
//     placeholder="Enter Your Password"
//     value={password}  
//     onChange={(e) => setPassword(e.target.value)}
//     onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//     style={{ paddingRight: "40px", width: "100%" }}
//   />
//   <button
//     type="button"
//     onClick={() => setShowPassword((v) => !v)}
//     aria-label={showPassword ? "Hide password" : "Show password"}
//     style={{
//       position: "absolute",
//       top:"14px",
//       right: "12px",
//       background: "none",
//       border: "none",
//       cursor: "pointer",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       color: "#6b7280",
//       fontSize: "1.1rem",
//       padding: 0,
//       margin: 0,
//       lineHeight: 0,
//       height: "20px",
//       width: "20px",
//     }}
//   >
//     {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
//   </button>
// </div>

//                   <div className="authcard__row">
//                     <label className="authcard__remember">
//                       <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
//                       Remember Me
//                     </label>
//                     <a href="#forgot" className="authcard__forgot">Forgot Password?</a>
//                   </div>

//                   {error && (
//                     <p className="authcard__error" style={{ color: "#e53e3e", fontSize: "0.85rem", marginTop: "4px" }}>
//                       {error}
//                     </p>
//                   )}

//                   <motion.button
//                     className="authcard__submit"
//                     whileHover={{ y: -2, boxShadow: "0 12px 26px rgba(245,166,35,0.4)" }}
//                     whileTap={{ scale: 0.97 }}
//                     onClick={handleLogin}
//                     disabled={loading}  
//                   >
//                     {loading ? "Logging in..." : "Login"}
//                   </motion.button>

//                   {authTab === "candidate" ? (
//                     <p className="authcard__register">
//                       Don't have an account? <Link to="/register">Register Now (Candidate Access)</Link>
//                     </p>
//                   ) : (
//                     <p className="authcard__register">
//                       New organisation? <Link to="/register?type=admin">Register Now (Admin Access)</Link>
//                     </p>
//                   )}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         </div>
//         <div className="container">
//           <Link to="/login/superadmin" className="home__superadmin-link">
//             Superadmin Login
//           </Link>
//         </div>
//       </div>

//       <StatsBar />
//       <HighlightBand />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import StatsBar from "../components/StatsBar";
import HighlightBand from "../components/HighlightBand";
import { loginCandidate, loginAdmin } from "../api/authApi";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import "./Home.css";
import api from "../api/axios";

const CLIENTS = ["IT-NetworkZ", "Kavin SA", "Nagpur Institute", "Prime Coaching", "Skillup Labs", "Bright Scholars"];

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("type") === "admin" ? "admin" : "candidate";
  const [authTab, setAuthTab] = useState(requestedTab);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showForgotPanel, setShowForgotPanel] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState(""); // "", "sending", "sent", "error"

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  function switchTab(tab) {
    setAuthTab(tab);
    setEmail("");
    setPassword("");
    setError("");
    setShowPassword(false);
    setShowForgotPanel(false);
    setForgotStatus("");
  }

  async function handleLogin() {
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response =
        authTab === "candidate"
          ? await loginCandidate(email.trim(), password.trim())
          : await loginAdmin(email.trim(), password.trim());

      if (!response.data) {
        setError("Invalid login response.");
        return;
      }

      localStorage.setItem("userType", authTab);
      localStorage.setItem("userData", JSON.stringify(response.data));

      if (remember) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate(authTab === "candidate" ? "/dashboard/candidate" : "/dashboard/admin");
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        setError(
          err.response.data?.Message ||
          err.response.data?.message ||
          err.response.data ||
          "Login failed."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!forgotEmail.trim()) return;
    setForgotStatus("sending");
    try {
      await api.post("/api/ForgotPassword", { Email: forgotEmail.trim() });
      setForgotStatus("sent");
    } catch (err) {
      console.error("Forgot password error:", err);
      setForgotStatus("error");
    }
  }

  return (
    <div className="home">
      <div className="home__hero">
        <motion.div
          className="home__hero-blob home__hero-blob--1"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="home__hero-blob home__hero-blob--2"
          animate={{ x: [0, -26, 0], y: [0, -18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container home__hero-inner">
          <motion.div
            className="home__pitch"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="home__eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Online Assessment Platform
            </motion.span>
            <h1 className="home__headline">
              <motion.span
                className="home__headline-line"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
              >
                Test knowledge.
              </motion.span>
              <br />
              <motion.span
                className="home__headline-accent"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
              >
                Prove it, instantly.
              </motion.span>
            </h1>
            <motion.p
              className="home__sub"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              Practice exams, live assessments, and question banks for institutions,
              organisations, and job seekers — with results the moment you finish.
            </motion.p>

            <div className="home__clients-panel">
              <div className="home__clients-tab">Our Clients</div>
              <div className="home__clients-track">
                <motion.div
                  className="home__clients-scroll"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  {[...CLIENTS, ...CLIENTS].map((c, i) => (
                    <span className="home__client-chip" key={i}>{c}</span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="authcard"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="authcard__tabs">
              <button
                className={"authcard__tab" + (authTab === "candidate" ? " authcard__tab--active" : "")}
                onClick={() => switchTab("candidate")}
              >
                Candidate Login
              </button>
              <button
                className={"authcard__tab" + (authTab === "admin" ? " authcard__tab--active" : "")}
                onClick={() => switchTab("admin")}
              >
                Admin Login
              </button>
            </div>

            <div className="authcard__body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={authTab}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <a className="authcard__linknote" href="#login">
                    Login Now ({authTab === "candidate" ? "Candidate Login" : "Admin Login"})
                  </a>

                  <label className="authcard__label">
                    <HiOutlineUser /> Email Id
                  </label>
                  <input
                    className="authcard__input"
                    placeholder="Enter Your Email Id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label className="authcard__label">
                    <HiOutlineLockClosed /> Password
                  </label>
                  <div
                    className="authcard__password-wrap"
                    style={{ position: "relative", display: "flex", alignItems: "center" }}
                  >
                    <input
                      className="authcard__input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      style={{ paddingRight: "40px", width: "100%" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "12px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6b7280",
                        fontSize: "1.1rem",
                        padding: 0,
                        margin: 0,
                        lineHeight: 0,
                        height: "20px",
                        width: "20px",
                      }}
                    >
                      {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                    </button>
                  </div>

                  <div className="authcard__row">
                    <label className="authcard__remember">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                      Remember Me
                    </label>
                    <button
                      type="button"
                      className="authcard__forgot"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      onClick={() => {
                        setShowForgotPanel((v) => !v);
                        setForgotStatus("");
                        setForgotEmail(email);
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {showForgotPanel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <label className="authcard__label">Enter your email to reset password</label>
                      <input
                        className="authcard__input"
                        placeholder="Enter Your Email Id"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                      <button
                        type="button"
                        className="authcard__submit"
                        style={{ marginTop: "8px" }}
                        disabled={forgotStatus === "sending"}
                        onClick={handleForgotPassword}
                      >
                        {forgotStatus === "sending" ? "Sending..." : "Send Reset Link"}
                      </button>

                      {forgotStatus === "sent" && (
                        <p style={{ color: "green", fontSize: "0.85rem", marginTop: "6px" }}>
                          If that email is registered, a reset link has been sent.
                        </p>
                      )}
                      {forgotStatus === "error" && (
                        <p style={{ color: "#e53e3e", fontSize: "0.85rem", marginTop: "6px" }}>
                          Something went wrong. Please try again.
                        </p>
                      )}
                    </motion.div>
                  )}

                  {error && (
                    <p className="authcard__error" style={{ color: "#e53e3e", fontSize: "0.85rem", marginTop: "4px" }}>
                      {error}
                    </p>
                  )}

                  <motion.button
                    className="authcard__submit"
                    whileHover={{ y: -2, boxShadow: "0 12px 26px rgba(245,166,35,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </motion.button>

                  {authTab === "candidate" ? (
                    <p className="authcard__register">
                      Don't have an account? <Link to="/register">Register Now (Candidate Access)</Link>
                    </p>
                  ) : (
                    <p className="authcard__register">
                      New organisation? <Link to="/register?type=admin">Register Now (Admin Access)</Link>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        <div className="container">
          <Link to="/login/superadmin" className="home__superadmin-link">
            Superadmin Login
          </Link>
        </div>
      </div>

      <StatsBar />
      <HighlightBand />
    </div>
  );
}
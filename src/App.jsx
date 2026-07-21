import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import Loader from "./components/Loader";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import TechSupport from "./pages/TechSupport";
import ExamPrice from "./pages/ExamPrice";
import SurveyPrice from "./pages/SurveyPrice";
import Register from "./pages/Register";
import SuperadminRegister from "./pages/SuperadminRegister";
import SuperadminLogin from "./pages/SuperadminLogin";
import DemoExam from "./pages/DemoExam";
import CandidateDashboard from "./pages/dashboard/candidate/CandidateDashboard";
import DemoExamCandidate from "./pages/dashboard/candidate/exams/demo/DemoExam";
import Exam from "./pages/dashboard/candidate/exams/exam/Exam";
import QuickPractice from "./pages/dashboard/candidate/exams/quick-practice/QuickPractice";
import CustomPractice from "./pages/dashboard/candidate/exams/custom-practice/CustomPractice";
import ScheduledNormalExam from "./pages/dashboard/candidate/exams/scheduled-normal/ScheduledNormalExam";
import ScheduledProctoredExam from "./pages/dashboard/candidate/exams/scheduled-proctored/ScheduledProctoredExam";
import PublicOpenExam from "./pages/dashboard/candidate/exams/public-open/PublicOpenExam";
import CandidateQuestionBank from "./pages/dashboard/candidate/questions/QuestionBank";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import QuestionBank from "./pages/dashboard/admin/questions/QuestionBank";
import AdminExamInstructions from "./pages/dashboard/admin/instructions/ExamInstructions";
import SuperadminDashboard from "./pages/dashboard/superadmin/SuperadminDashboard";
import SuperadminQuestionBank from "./pages/dashboard/superadmin/questions/QuestionBank";
import SuperadminExamInstructions from "./pages/dashboard/superadmin/instructions/ExamInstructions";
import CandidateProfile from "./pages/dashboard/candidate/profile/CandidateProfile";
import "./App.css";

export default function App() {
  const location = useLocation();
  const isExam = location.pathname === "/demo-exam";
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isBare = isExam || isDashboard;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1900);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <motion.div
        className="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {!isBare && <ScrollProgress />}
        {!isBare && <TopBar />}
        {!isBare && <Navbar />}
        <main className="app__main">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/tech-support" element={<PageTransition><TechSupport /></PageTransition>} />
              <Route path="/exam-price" element={<PageTransition><ExamPrice /></PageTransition>} />
              <Route path="/survey-price" element={<PageTransition><SurveyPrice /></PageTransition>} />
              <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
              <Route path="/register/superadmin" element={<PageTransition><SuperadminRegister /></PageTransition>} />
              <Route path="/login/superadmin" element={<PageTransition><SuperadminLogin /></PageTransition>} />
              <Route path="/demo-exam" element={<PageTransition><DemoExam /></PageTransition>} />
              <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
              <Route path="/dashboard/candidate/exams/demo" element={<DemoExamCandidate />} />
              <Route path="/dashboard/candidate/exams/exam" element={<Exam />} />
              <Route path="/dashboard/candidate/exams/quick-practice" element={<QuickPractice />} />
              <Route path="/dashboard/candidate/exams/custom-practice" element={<CustomPractice />} />
              <Route path="/dashboard/candidate/exams/scheduled-normal" element={<ScheduledNormalExam />} />
              <Route path="/dashboard/candidate/exams/scheduled-proctored" element={<ScheduledProctoredExam />} />
              <Route path="/dashboard/candidate/exams/public-open" element={<PublicOpenExam />} />
              <Route path="/dashboard/candidate/questions" element={<CandidateQuestionBank />} />
              <Route path="/dashboard/candidate/profile" element={<CandidateProfile />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/admin/questions" element={<QuestionBank />} />
              <Route path="/dashboard/admin/instructions" element={<AdminExamInstructions />} />
              <Route path="/dashboard/superadmin" element={<SuperadminDashboard />} />
              <Route path="/dashboard/superadmin/questions" element={<SuperadminQuestionBank />} />
              <Route path="/dashboard/superadmin/instructions" element={<SuperadminExamInstructions />} />
            </Routes>
          </AnimatePresence>
        </main>
        {!isBare && <Footer />}
        {!isBare && <BackToTop />}
      </motion.div>
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineClock, HiOutlineArrowLeft, HiOutlineArrowRight,
  HiOutlineCheckCircle, HiOutlineFlag, HiOutlineXMark,
  HiOutlineExclamationTriangle, HiOutlineClipboardDocumentList,
  HiOutlineEye, HiOutlineArrowsPointingOut,
} from "react-icons/hi2";
import { EXAM_SUBJECTS as SUBJECTS, EXAM_QUESTION_BANK as QUESTION_BANK } from "../../../../../data/examQuestions";
import { loadHistory, saveAttempt, formatDuration, formatDate } from "../../../../../data/examRunHistory";
import "./Exam.css";

const DURATION = 15 * 60; // 15 minutes for this exam's 12-question sets

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function computeScore(questions, answers) {
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.answer) correct += 1;
  });
  return { correct, total: questions.length };
}

const MAX_VIOLATIONS = 3;

async function requestFullscreenSafe(el) {
  const target = el || document.documentElement;
  try {
    if (target.requestFullscreen) await target.requestFullscreen();
    else if (target.webkitRequestFullscreen) await target.webkitRequestFullscreen();
    else if (target.msRequestFullscreen) await target.msRequestFullscreen();
  } catch {
    /* fullscreen may be blocked in some environments — exam still continues windowed */
  }
}

function exitFullscreenSafe() {
  const isFs = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  if (!isFs) return;
  try {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  } catch {
    /* ignore */
  }
}

export default function Exam() {
  // select | instructions | exam | result | history | review
  const [stage, setStage] = useState("select");
  const [subjectId, setSubjectId] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [visited, setVisited] = useState({});
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(null);
  const [history, setHistory] = useState([]);
  const [reviewAttempt, setReviewAttempt] = useState(null);
  const [focusWarning, setFocusWarning] = useState(null); // null | "fullscreen" | "tabswitch"
  const [violationCount, setViolationCount] = useState(0);
  const [showMalpractice, setShowMalpractice] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [keyLockNotice, setKeyLockNotice] = useState(false);
  const keyNoticeRef = useRef(0);
  const keyNoticeTimeoutRef = useRef(null);
  const timerRef = useRef(null);
  const examRootRef = useRef(null);
  const timeLeftRef = useRef(DURATION);
  const answersRef = useRef({});
  const violationRef = useRef(0);
  const suppressFocusRef = useRef(false);
  const navigate = useNavigate();

  const questions = useMemo(() => (subjectId ? QUESTION_BANK[subjectId] : []), [subjectId]);
  const subjectName = SUBJECTS.find((s) => s.id === subjectId)?.name;

  useEffect(() => {
    if (stage !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setShowTimeUp(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stage]);

  useEffect(() => {
    if (stage === "exam") setVisited((v) => ({ ...v, [current]: true }));
  }, [current, stage]);

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  // ---- Focus-mode: fullscreen + tab-switch monitoring during the live exam ----
  useEffect(() => {
    if (stage !== "exam") return;

    function registerViolation(type) {
      if (suppressFocusRef.current) return;
      violationRef.current += 1;
      setViolationCount(violationRef.current);

      if (violationRef.current >= MAX_VIOLATIONS) {
        clearInterval(timerRef.current);
        finalizeAndSave(timeLeftRef.current, answersRef.current);
        exitFullscreenSafe();
        setFocusWarning(null);
        setShowMalpractice(true);
      } else {
        setFocusWarning(type);
      }
    }

    function handleFsChange() {
      const isFs = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      if (!isFs) registerViolation("fullscreen");
    }

    function handleVisibility() {
      if (document.hidden) registerViolation("tabswitch");
    }

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Always leave fullscreen if the user navigates away from this page entirely
  useEffect(() => () => exitFullscreenSafe(), []);

  // ---- Keyboard lock: only plain typing characters pass through; everything
  // else (shortcuts, function keys, Tab, Esc, Alt/Meta combos, PrintScreen…)
  // is blocked while the live exam is running. ----
  useEffect(() => {
    if (stage !== "exam") return;

    function isTypingTarget(el) {
      return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
    }

    function handleKeyDown(e) {
      const target = e.target;
      const printable = e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey;
      const editingKey = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
        && !e.ctrlKey && !e.altKey && !e.metaKey;

      if (isTypingTarget(target) && (printable || editingKey)) {
        return; // allow normal typing inside an actual text field
      }

      e.preventDefault();
      e.stopPropagation();
      showKeyLockNotice();
    }

    function handleContextMenu(e) {
      e.preventDefault();
      showKeyLockNotice();
    }

    function handleClipboard(e) {
      e.preventDefault();
      showKeyLockNotice();
    }

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleClipboard);
    document.addEventListener("cut", handleClipboard);
    document.addEventListener("paste", handleClipboard);

    if (navigator.keyboard?.lock) {
      navigator.keyboard.lock(["Escape", "Tab", "AltLeft", "AltRight", "MetaLeft", "MetaRight"]).catch(() => {});
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleClipboard);
      document.removeEventListener("cut", handleClipboard);
      document.removeEventListener("paste", handleClipboard);
      if (navigator.keyboard?.unlock) {
        try { navigator.keyboard.unlock(); } catch { /* ignore */ }
      }
    };
  }, [stage]);

  function showKeyLockNotice() {
    const now = Date.now();
    if (now - keyNoticeRef.current < 1200) return; // throttle repeat presses
    keyNoticeRef.current = now;
    setKeyLockNotice(true);
    clearTimeout(keyNoticeTimeoutRef.current);
    keyNoticeTimeoutRef.current = setTimeout(() => setKeyLockNotice(false), 1600);
  }

  function startExam() {
    setAnswers({});
    setMarked({});
    setVisited({ 0: true });
    setCurrent(0);
    setTimeLeft(DURATION);
    violationRef.current = 0;
    setViolationCount(0);
    setFocusWarning(null);
    suppressFocusRef.current = false;
    setStage("exam");
    requestFullscreenSafe(examRootRef.current);
  }

  function selectOption(qIndex, optIndex) {
    setAnswers((a) => ({ ...a, [qIndex]: optIndex }));
  }

  function toggleMark() {
    setMarked((m) => ({ ...m, [current]: !m[current] }));
  }

  function goTo(i) {
    setCurrent(i);
  }

  function finalizeAndSave(finalTimeLeft, answersOverride) {
    const finalAnswers = answersOverride || answers;
    const sc = computeScore(questions, finalAnswers);
    const attempt = {
      id: Date.now(),
      subjectId,
      subjectName,
      date: new Date().toISOString(),
      durationTakenSeconds: DURATION - finalTimeLeft,
      correct: sc.correct,
      total: sc.total,
      answers: { ...finalAnswers },
      questions,
    };
    saveAttempt(attempt);
    setLastAttempt(attempt);
    return attempt;
  }

  function submit() {
    clearInterval(timerRef.current);
    finalizeAndSave(timeLeft);
    suppressFocusRef.current = true;
    exitFullscreenSafe();
    setShowSubmitSuccess(true);
  }

  function confirmSubmitSuccess() {
    setShowSubmitSuccess(false);
    setStage("result");
  }

  function confirmTimeUp() {
    finalizeAndSave(0);
    suppressFocusRef.current = true;
    exitFullscreenSafe();
    setShowTimeUp(false);
    setStage("result");
  }

  function resumeFocus() {
    setFocusWarning(null);
    requestFullscreenSafe(examRootRef.current);
  }

  function confirmMalpractice() {
    setShowMalpractice(false);
    setStage("result");
  }

  function requestExit() {
    if (stage === "exam" || stage === "instructions") {
      setShowExitConfirm(true);
    } else {
      navigate("/dashboard/candidate");
    }
  }

  function confirmExit() {
    suppressFocusRef.current = true;
    exitFullscreenSafe();
    navigate("/dashboard/candidate");
  }

  function openHistory() {
    setHistory(loadHistory());
    setStage("history");
  }

  function openReview(attempt) {
    setReviewAttempt(attempt);
    setStage("review");
  }

  return (
    <div className={"rexam" + (stage === "exam" ? " rexam--locked" : "")} ref={examRootRef}>
      <div className="rexam__topbar">
        <Link to="/dashboard/candidate" className="rexam__brand">
          <span className="rexam__brand-e">e</span>XAM <span className="rexam__brand-sep">/</span> {subjectName ? subjectName : "Exam"}
        </Link>
        {stage === "exam" && (
          <div className="rexam__timer-group">
            <span className="rexam__focusbadge">
              <HiOutlineArrowsPointingOut /> Focus Mode
            </span>
            <motion.div
              className={"rexam__timer" + (timeLeft <= 30 ? " rexam__timer--danger" : "")}
              animate={timeLeft <= 30 ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 0.8, repeat: timeLeft <= 30 ? Infinity : 0 }}
            >
              <HiOutlineClock />
              {formatTime(timeLeft)}
            </motion.div>
          </div>
        )}
        <button className="rexam__exit" onClick={requestExit}><HiOutlineXMark /></button>
      </div>

      <AnimatePresence>
        {keyLockNotice && (
          <motion.div
            className="rexam__keytoast"
            initial={{ opacity: 0, y: -12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -12, x: "-50%" }}
            transition={{ duration: 0.25 }}
          >
            Keyboard shortcuts, right-click, and copy/paste are disabled during this assessment.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === "select" && (
          <motion.div key="select" className="rexam__stage" {...fade}>
            <SelectSubject
              subjectId={subjectId}
              onChange={setSubjectId}
              onNext={() => setStage("instructions")}
              onHistory={openHistory}
            />
          </motion.div>
        )}

        {stage === "instructions" && (
          <motion.div key="instructions" className="rexam__stage" {...fade}>
            <Instructions
              subjectName={subjectName}
              onBack={() => setStage("select")}
              onStart={startExam}
            />
          </motion.div>
        )}

        {stage === "exam" && (
          <motion.div key="exam" className="rexam__stage rexam__stage--exam" {...fade}>
            <ExamRunner
              questions={questions}
              current={current}
              answers={answers}
              marked={marked}
              visited={visited}
              onSelect={selectOption}
              onToggleMark={toggleMark}
              onGoTo={goTo}
              onNext={() => setCurrent((c) => Math.min(c + 1, questions.length - 1))}
              onPrev={() => setCurrent((c) => Math.max(c - 1, 0))}
              onSubmit={submit}
            />
          </motion.div>
        )}

        {stage === "result" && (
          <motion.div key="result" className="rexam__stage" {...fade}>
            <Result
              attempt={lastAttempt}
              onRetake={() => setStage("select")}
              onHistory={openHistory}
            />
          </motion.div>
        )}

        {stage === "history" && (
          <motion.div key="history" className="rexam__stage" {...fade}>
            <History
              history={history}
              onBack={() => setStage("select")}
              onReview={openReview}
            />
          </motion.div>
        )}

        {stage === "review" && (
          <motion.div key="review" className="rexam__stage" {...fade}>
            <Review attempt={reviewAttempt} onBack={() => setStage("history")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Exit confirmation ---- */}
      <AnimatePresence>
        {showExitConfirm && (
          <Modal onClose={() => setShowExitConfirm(false)}>
            <div className="rexammodal__icon rexammodal__icon--warn"><HiOutlineExclamationTriangle /></div>
            <h3>Exit this assessment?</h3>
            <p>Your progress on this attempt will be lost and this session will not be saved to your exam history.</p>
            <div className="rexammodal__actions">
              <button className="rexammodal__ghost" onClick={() => setShowExitConfirm(false)}>Stay on assessment</button>
              <button className="rexammodal__danger" onClick={confirmExit}>Exit anyway</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ---- Time up notice ---- */}
      <AnimatePresence>
        {showTimeUp && (
          <Modal>
            <div className="rexammodal__icon rexammodal__icon--time"><HiOutlineClock /></div>
            <h3>Time's up</h3>
            <p>
              Your 15 minutes are over, so the assessment has been submitted automatically with
              your current answers. If something went wrong or you couldn't complete it in time,
              please contact admin at <strong>support@ex-am.com</strong>.
            </p>
            <div className="rexammodal__actions">
              <button className="rexammodal__primary" onClick={confirmTimeUp}>View Result</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ---- Focus-mode violation (exited fullscreen / switched tab) ---- */}
      <AnimatePresence>
        {focusWarning && (
          <Modal>
            <div className="rexammodal__icon rexammodal__icon--warn"><HiOutlineExclamationTriangle /></div>
            <h3>{focusWarning === "fullscreen" ? "You left fullscreen mode" : "You switched away from the assessment"}</h3>
            <p>
              This assessment runs in focus mode — please stay in fullscreen and on this tab until
              you submit. This was warning <strong>{violationCount} of {MAX_VIOLATIONS}</strong>.
              After {MAX_VIOLATIONS} warnings the assessment will be submitted automatically and
              you'll need to contact admin to retake it.
            </p>
            <div className="rexammodal__actions">
              <button className="rexammodal__primary" onClick={resumeFocus}>Resume Assessment</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ---- Manual submit success ---- */}
      <AnimatePresence>
        {showSubmitSuccess && (
          <Modal>
            <motion.div
              className="rexammodal__icon rexammodal__icon--success"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <HiOutlineCheckCircle />
            </motion.div>
            <h3>Your assessment has been successfully completed</h3>
            <p>Nice work — your answers have been recorded. Click OK to view your result.</p>
            <div className="rexammodal__actions">
              <motion.button
                className="rexammodal__primary"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={confirmSubmitSuccess}
              >
                OK
              </motion.button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ---- Auto-submitted after repeated violations ---- */}
      <AnimatePresence>
        {showMalpractice && (
          <Modal>
            <div className="rexammodal__icon rexammodal__icon--time"><HiOutlineExclamationTriangle /></div>
            <h3>Assessment submitted automatically</h3>
            <p>
              We detected repeated focus-mode violations (leaving fullscreen or switching tabs), so
              this attempt has been submitted with your current answers. If this was unintentional,
              please contact admin at <strong>support@ex-am.com</strong> to arrange a retake.
            </p>
            <div className="rexammodal__actions">
              <button className="rexammodal__primary" onClick={confirmMalpractice}>View Result</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.3 },
};

function Modal({ children, onClose }) {
  return (
    <motion.div
      className="rexammodal__overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rexammodal"
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function SelectSubject({ subjectId, onChange, onNext, onHistory }) {
  return (
    <div className="container rexamselect">
      <div className="rexamselect__topline">
        <motion.div
          className="rexamselect__field"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <label>Subject Name</label>
          <div className="rexamselect__row">
            <select value={subjectId} onChange={(e) => onChange(e.target.value)}>
              <option value="">Select Subject Name</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <motion.button
              className="rexamselect__add"
              disabled={!subjectId}
              whileHover={subjectId ? { y: -2 } : {}}
              whileTap={subjectId ? { scale: 0.96 } : {}}
              onClick={onNext}
            >
              Add Subject
            </motion.button>
          </div>
        </motion.div>

        <motion.button
          className="rexamselect__history-btn"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onHistory}
        >
          <HiOutlineClipboardDocumentList /> Exam History
        </motion.button>
      </div>

      <div className="rexamselect__grid">
        <motion.div
          className="rexamselect__panel"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <h3>Exam</h3>
          <table className="rexamselect__table">
            <tbody>
              <tr><td>1</td><td>Exam</td><td>Exam</td></tr>
              <tr><td>2</td><td>Subject</td><td>{subjectId ? SUBJECTS.find((s) => s.id === subjectId).name : "—"}</td></tr>
              <tr><td>3</td><td>Duration</td><td><strong>15 min.</strong></td></tr>
              <tr><td>4</td><td>Next Re-take</td><td className="rexamselect__available">Available</td></tr>
              <tr><td>5</td><td>Passing Score</td><td>50.00 %</td></tr>
              <tr><td>6</td><td>No. of Questions</td><td>12</td></tr>
            </tbody>
          </table>
        </motion.div>

        <motion.div
          className="rexamselect__panel"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3>Terms and Conditions</h3>
          <ul className="rexamselect__terms">
            <li>To kindly do not refresh the exam page.</li>
            <li>Each question carries equal marks; there is no negative marking.</li>
            <li>Once submitted, the assessment cannot be reattempted until the retake window opens.</li>
          </ul>

          <h3 style={{ marginTop: 22 }}>Take Assessment</h3>
          {!subjectId ? (
            <div className="rexamselect__warning">First select subject to begin assessment.</div>
          ) : (
            <div className="rexamselect__ready">Ready — subject selected. Click below to review instructions.</div>
          )}
          <motion.button
            className="rexamselect__instructions"
            disabled={!subjectId}
            whileHover={subjectId ? { y: -2 } : {}}
            whileTap={subjectId ? { scale: 0.96 } : {}}
            onClick={onNext}
          >
            Read Instructions
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

function Instructions({ subjectName, onBack, onStart }) {
  return (
    <div className="container rexaminstructions">
      <motion.div
        className="rexaminstructions__card"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <h2>Instructions — {subjectName}</h2>
        <ul>
          <li>This assessment contains <strong>12 questions</strong> and must be completed in <strong>15 minutes</strong>.</li>
          <li>Each question has exactly one correct answer.</li>
          <li>Use the question palette to jump between questions at any time.</li>
          <li>You can mark a question for review and return to it later.</li>
          <li>The assessment auto-submits when the timer reaches zero.</li>
          <li>This is a focus-mode assessment — it runs in fullscreen. Leaving fullscreen or switching tabs will trigger a warning, and repeated attempts submit it automatically.</li>
          <li>Keyboard shortcuts, right-click, and copy/paste are disabled once the assessment starts — only the on-screen options are used to answer.</li>
          <li>Passing score is 50%.</li>
        </ul>
        <div className="rexaminstructions__actions">
          <button className="rexaminstructions__back" onClick={onBack}>
            <HiOutlineArrowLeft /> Back
          </button>
          <motion.button
            className="rexaminstructions__start"
            whileHover={{ y: -2, boxShadow: "0 12px 26px rgba(63,145,66,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
          >
            Start Assessment
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function ExamRunner({ questions, current, answers, marked, visited, onSelect, onToggleMark, onGoTo, onNext, onPrev, onSubmit }) {
  const q = questions[current];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="container rexamrunner">
      <div className="rexamrunner__main">
        <motion.div
          key={current}
          className="rexamcard"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rexamcard__head">
            <span>Question {current + 1} of {questions.length}</span>
            <button className={"rexamcard__mark" + (marked[current] ? " rexamcard__mark--active" : "")} onClick={onToggleMark}>
              <HiOutlineFlag /> {marked[current] ? "Marked" : "Mark for review"}
            </button>
          </div>
          <div className="rexamcard__scrollbody">
            <h3 className="rexamcard__question">{q.q}</h3>
            <div className="rexamcard__options">
              {q.options.map((opt, i) => (
                <motion.button
                  key={i}
                  className={"rexamcard__option" + (answers[current] === i ? " rexamcard__option--active" : "")}
                  onClick={() => onSelect(current, i)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="rexamcard__option-letter">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="rexamcard__nav">
            <div className="rexamcard__navgroup">
              <button
                className="rexamcard__iconbtn"
                disabled={current === 0}
                onClick={onPrev}
                title="Previous"
                aria-label="Previous"
              >
                <HiOutlineArrowLeft />
              </button>
              {current === questions.length - 1 ? (
                <motion.button
                  className="rexamcard__submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onSubmit}
                >
                  <HiOutlineCheckCircle /> Submit Assessment
                </motion.button>
              ) : (
                <button
                  className="rexamcard__iconbtn rexamcard__iconbtn--primary"
                  onClick={onNext}
                  title="Next"
                  aria-label="Next"
                >
                  <HiOutlineArrowRight />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <aside className="rexampalette">
        <div className="rexampalette__summary">
          <div><span className="rexampalette__dot rexampalette__dot--answered" /> Answered ({answeredCount})</div>
          <div><span className="rexampalette__dot rexampalette__dot--marked" /> Marked ({Object.values(marked).filter(Boolean).length})</div>
          <div><span className="rexampalette__dot rexampalette__dot--notvisited" /> Not visited</div>
        </div>
        <div className="rexampalette__grid">
          {questions.map((_, i) => {
            let state = "notvisited";
            if (marked[i]) state = "marked";
            else if (answers[i] !== undefined) state = "answered";
            else if (visited[i]) state = "visited";
            return (
              <motion.button
                key={i}
                className={`rexampalette__cell rexampalette__cell--${state}` + (i === current ? " rexampalette__cell--current" : "")}
                onClick={() => onGoTo(i)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
              >
                {i + 1}
              </motion.button>
            );
          })}
        </div>
        <motion.button
          className="rexampalette__submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
        >
          Submit Assessment
        </motion.button>
      </aside>
    </div>
  );
}

function ScoreBreakdown({ questions, answers }) {
  return (
    <div className="rexamresult__breakdown">
      {questions.map((q, i) => {
        const isCorrect = answers[i] === q.answer;
        const attempted = answers[i] !== undefined;
        return (
          <div className={"rexamresult__row" + (isCorrect ? " rexamresult__row--correct" : attempted ? " rexamresult__row--wrong" : " rexamresult__row--skip")} key={i}>
            <span className="rexamresult__row-index">{i + 1}</span>
            <span className="rexamresult__row-q">{q.q}</span>
            <span className="rexamresult__row-status">
              {isCorrect ? "Correct" : attempted ? "Incorrect" : "Not attempted"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Result({ attempt, onRetake, onHistory }) {
  if (!attempt) return null;
  const percent = Math.round((attempt.correct / attempt.total) * 100);
  const passed = percent >= 50;

  return (
    <div className="container rexamresult">
      <motion.div
        className="rexamresult__card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className={"rexamresult__ring" + (passed ? " rexamresult__ring--pass" : " rexamresult__ring--fail")}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <span>{percent}%</span>
        </motion.div>
        <h2>{passed ? "Assessment Passed" : "Assessment Not Passed"}</h2>
        <p className="rexamresult__meta">
          {attempt.subjectName} · {attempt.correct} / {attempt.total} correct · {formatDuration(attempt.durationTakenSeconds)} taken · Passing score 50%
        </p>

        <ScoreBreakdown questions={attempt.questions} answers={attempt.answers} />

        <div className="rexamresult__actions">
          <motion.button className="rexamresult__retake" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={onRetake}>
            Retake Exam
          </motion.button>
          <button className="rexamresult__history" onClick={onHistory}>
            <HiOutlineClipboardDocumentList /> Exam History
          </button>
          <Link to="/dashboard/candidate" className="rexamresult__home">Back to Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
}

function History({ history, onBack, onReview }) {
  return (
    <div className="container rexamhistory">
      <motion.div
        className="rexamhistory__card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rexamhistory__head">
          <h2>Exam History</h2>
          <button className="rexamhistory__back" onClick={onBack}><HiOutlineArrowLeft /> Back</button>
        </div>

        {history.length === 0 ? (
          <div className="rexamhistory__empty">
            No attempts yet — finish a demo exam and it will show up here.
          </div>
        ) : (
          <div className="rexamhistory__tablewrap">
            <table className="rexamhistory__table">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Date &amp; Time</th>
                  <th>Duration</th>
                  <th>Score</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {history.map((a, i) => {
                  const percent = Math.round((a.correct / a.total) * 100);
                  const passed = percent >= 50;
                  return (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <td className="rexamhistory__subject">{a.subjectName}</td>
                      <td>{formatDate(a.date)}</td>
                      <td>{formatDuration(a.durationTakenSeconds)}</td>
                      <td>
                        <span className={"rexamhistory__badge" + (passed ? " rexamhistory__badge--pass" : " rexamhistory__badge--fail")}>
                          {a.correct}/{a.total} · {percent}%
                        </span>
                      </td>
                      <td>
                        <button className="rexamhistory__review" onClick={() => onReview(a)}>
                          <HiOutlineEye /> Check Answers
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Review({ attempt, onBack }) {
  if (!attempt) return null;
  const percent = Math.round((attempt.correct / attempt.total) * 100);
  const passed = percent >= 50;

  return (
    <div className="container rexamresult">
      <motion.div
        className="rexamresult__card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button className="rexamhistory__back" style={{ marginBottom: 18 }} onClick={onBack}>
          <HiOutlineArrowLeft /> Back to history
        </button>
        <motion.div
          className={"rexamresult__ring" + (passed ? " rexamresult__ring--pass" : " rexamresult__ring--fail")}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <span>{percent}%</span>
        </motion.div>
        <h2>{attempt.subjectName}</h2>
        <p className="rexamresult__meta">
          {formatDate(attempt.date)} · {attempt.correct} / {attempt.total} correct · {formatDuration(attempt.durationTakenSeconds)} taken
        </p>
        <ScoreBreakdown questions={attempt.questions} answers={attempt.answers} />
      </motion.div>
    </div>
  );
}

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowPath, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import "./Captcha.css";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChallenge() {
  const a = randInt(2, 12);
  const b = randInt(1, 9);
  const ops = ["+", "−", "×"];
  const op = ops[randInt(0, ops.length - 1)];
  let answer;
  if (op === "+") answer = a + b;
  else if (op === "−") answer = a - b;
  else answer = a * b;
  return { a, b, op, answer };
}

const Captcha = forwardRef(function Captcha({ onValidChange }, ref) {
  const [challenge, setChallenge] = useState(generateChallenge);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null); // null | "correct" | "wrong"

  useImperativeHandle(ref, () => ({
    verify() {
      const ok = Number(value) === challenge.answer;
      setStatus(ok ? "correct" : "wrong");
      onValidChange?.(ok);
      return ok;
    },
    reset() {
      refresh();
    },
  }));

  useEffect(() => {
    onValidChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refresh() {
    setChallenge(generateChallenge());
    setValue("");
    setStatus(null);
    onValidChange?.(false);
  }

  function handleChange(e) {
    const v = e.target.value.replace(/[^\d-]/g, "");
    setValue(v);
    setStatus(null);
    onValidChange?.(false);
  }

  return (
    <div className="captcha">
      <label className="captcha__label">Security Check *</label>
      <div className="captcha__row">
        <motion.div
          className="captcha__challenge"
          key={`${challenge.a}${challenge.op}${challenge.b}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span>{challenge.a}</span>
          <span className="captcha__op">{challenge.op}</span>
          <span>{challenge.b}</span>
          <span className="captcha__eq">=</span>
          <span className="captcha__q">?</span>
        </motion.div>

        <motion.button
          type="button"
          className="captcha__refresh"
          onClick={refresh}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          aria-label="Get a new captcha"
        >
          <HiOutlineArrowPath />
        </motion.button>

        <input
          className={
            "captcha__input" +
            (status === "correct" ? " captcha__input--ok" : "") +
            (status === "wrong" ? " captcha__input--bad" : "")
          }
          inputMode="numeric"
          placeholder="Your answer"
          value={value}
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {status === "correct" && (
            <motion.span
              key="ok"
              className="captcha__status captcha__status--ok"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              <HiOutlineCheckCircle />
            </motion.span>
          )}
          {status === "wrong" && (
            <motion.span
              key="bad"
              className="captcha__status captcha__status--bad"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              <HiOutlineXCircle />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {status === "wrong" && (
        <motion.p
          className="captcha__hint"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          That's not quite right — try again or tap refresh for a new sum.
        </motion.p>
      )}
    </div>
  );
});

export default Captcha;

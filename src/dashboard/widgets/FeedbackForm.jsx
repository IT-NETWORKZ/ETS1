import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser, HiOutlineChatBubbleLeftEllipsis, HiOutlinePhoto,
  HiOutlineXMark, HiOutlineCheckCircle, HiOutlinePaperAirplane,
} from "react-icons/hi2";
import StarRating from "./StarRating";
import { addFeedback } from "../../data/feedbackStore";
import "./FeedbackForm.css";

export default function FeedbackForm({ role, roleColor, onSubmitted }) {
  const fileRef = useRef(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function readImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    readImage(e.dataTransfer.files?.[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim() || rating === 0) {
      setError("Please add your name, a message, and a star rating.");
      return;
    }
    setError("");
    setSending(true);

    // Simulated submit delay so the animation has room to play.
    setTimeout(() => {
      addFeedback(role, { name: name.trim(), message: message.trim(), rating, image });
      setSending(false);
      setSent(true);
      onSubmitted?.();
      setTimeout(() => {
        setSent(false);
        setName("");
        setMessage("");
        setRating(0);
        setImage(null);
      }, 1800);
    }, 700);
  }

  return (
    <div className="feedbackform" style={{ "--role-color": roleColor }}>
      <div className="feedbackform__blob feedbackform__blob--1" />
      <div className="feedbackform__blob feedbackform__blob--2" />

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            className="feedbackform__success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="feedbackform__successring"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <HiOutlineCheckCircle />
            </motion.div>
            <h3>Thanks for the feedback!</h3>
            <p>Your response has been recorded.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="feedbackform__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="feedbackform__grid">
              <div className="feedbackform__left">
                <label
                  className={"feedbackform__drop" + (dragOver ? " feedbackform__drop--over" : "") + (image ? " feedbackform__drop--filled" : "")}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {image ? (
                    <>
                      <img src={image} alt="Attachment preview" className="feedbackform__preview" />
                      <button
                        type="button"
                        className="feedbackform__removeimg"
                        onClick={(e) => { e.preventDefault(); setImage(null); }}
                      >
                        <HiOutlineXMark />
                      </button>
                    </>
                  ) : (
                    <motion.div
                      className="feedbackform__dropinner"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <HiOutlinePhoto />
                      <span>Drag & drop an image, or click to add</span>
                    </motion.div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => readImage(e.target.files?.[0])}
                  />
                </label>

                <div className="feedbackform__ratingblock">
                  <span className="feedbackform__ratinglabel">Overall Satisfaction</span>
                  <StarRating value={rating} onChange={setRating} />
                </div>
              </div>

              <div className="feedbackform__right">
                <label className="feedbackform__field">
                  <span><HiOutlineUser /> Name</span>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label className="feedbackform__field feedbackform__field--grow">
                  <span><HiOutlineChatBubbleLeftEllipsis /> Message</span>
                  <textarea
                    placeholder="Tell us what worked well or what we could improve..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="feedbackform__error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="feedbackform__submit"
              disabled={sending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {sending ? (
                <motion.span
                  className="feedbackform__spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <HiOutlinePaperAirplane /> Submit Feedback
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

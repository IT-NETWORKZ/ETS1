import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiStar, HiOutlineXMark, HiOutlinePhoto } from "react-icons/hi2";
import MasterTable from "./MasterTable";
import FeedbackStatusPicker from "./FeedbackStatusPicker";
import { useFeedbackList, updateFeedbackStatus } from "../../data/feedbackStore";
import "./FeedbackTable.css";

function StarsReadout({ rating }) {
  return (
    <span className="feedbacktable__stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <HiStar key={n} className={n <= rating ? "feedbacktable__star--on" : "feedbacktable__star--off"} />
      ))}
    </span>
  );
}

export default function FeedbackTable({ role, title }) {
  const records = useFeedbackList(role);
  const [lightbox, setLightbox] = useState(null);

  const rows = records.map((r, i) => ({
    ...r,
    srNo: i + 1,
    dateText: new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  }));

  const columns = [
    { key: "srNo", label: "Sr.No", sortable: true },
    { key: "dateText", label: "Date", sortable: true },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (row) => <StarsReadout rating={row.rating} />,
    },
    {
      key: "image",
      label: "Image",
      render: (row) =>
        row.image ? (
          <button type="button" className="feedbacktable__thumbbtn" onClick={() => setLightbox(row.image)}>
            <img src={row.image} alt="Feedback attachment" className="feedbacktable__thumb" />
          </button>
        ) : (
          <span className="feedbacktable__noimg"><HiOutlinePhoto /></span>
        ),
    },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <div className="feedbacktable__msgcell">
          <span className="feedbacktable__msgname">{row.name}</span>
          <span className="feedbacktable__msgtext">{row.message}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <FeedbackStatusPicker value={row.status} onChange={(status) => updateFeedbackStatus(row.id, status)} />
      ),
    },
  ];

  return (
    <>
      <MasterTable
        title={title}
        columns={columns}
        rows={rows}
        searchKeys={["name", "message", "status"]}
        keyField="id"
      />

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="feedbacktable__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt="Feedback attachment full size"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="feedbacktable__lightboxclose" onClick={() => setLightbox(null)}>
              <HiOutlineXMark />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

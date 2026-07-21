import { HiOutlineBolt } from "react-icons/hi2";
import "./AuditTicker.css";

export default function AuditTicker({ items }) {
  const loop = [...items, ...items];
  return (
    <div className="audticker">
      <div className="audticker__tag"><HiOutlineBolt /> LIVE</div>
      <div className="audticker__viewport">
        <div className="audticker__track">
          {loop.map((a, i) => (
            <span className="audticker__item" key={i}>
              <strong>{a.actor}</strong> {a.action} <em>· {a.time}</em>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

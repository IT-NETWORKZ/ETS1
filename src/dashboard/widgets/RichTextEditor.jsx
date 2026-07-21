import { useEffect, useRef } from "react";
import {
  HiOutlineBold, HiOutlineItalic, HiOutlineUnderline, HiOutlineListBullet,
  HiOutlineNumberedList, HiOutlineLink, HiOutlineBackspace,
} from "react-icons/hi2";
import "./RichTextEditor.css";

const TOOLS = [
  { cmd: "bold", icon: HiOutlineBold, label: "Bold" },
  { cmd: "italic", icon: HiOutlineItalic, label: "Italic" },
  { cmd: "underline", icon: HiOutlineUnderline, label: "Underline" },
  { cmd: "insertUnorderedList", icon: HiOutlineListBullet, label: "Bullet list" },
  { cmd: "insertOrderedList", icon: HiOutlineNumberedList, label: "Numbered list" },
];

export default function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const lastValue = useRef(undefined);

  // Only push the value into the DOM when it changed from *outside*
  // (e.g. switching the exam-type dropdown) — never while the user is typing,
  // or the cursor would jump to the start on every keystroke.
  useEffect(() => {
    if (ref.current && value !== lastValue.current && document.activeElement !== ref.current) {
      ref.current.innerHTML = value || "";
      lastValue.current = value;
    }
  }, [value]);

  function emit() {
    const html = ref.current.innerHTML;
    lastValue.current = html;
    onChange(html);
  }

  function run(cmd) {
    ref.current.focus();
    if (cmd === "link") {
      const url = window.prompt("Link URL");
      if (url) document.execCommand("createLink", false, url);
    } else if (cmd === "clear") {
      document.execCommand("removeFormat");
      document.execCommand("unlink");
    } else {
      document.execCommand(cmd);
    }
    emit();
  }

  const isEmpty = !value || value.replace(/<[^>]+>/g, "").trim() === "";

  return (
    <div className="rte">
      <div className="rte__toolbar">
        {TOOLS.map((t) => (
          <button
            key={t.cmd} type="button" className="rte__btn" title={t.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(t.cmd)}
          >
            <t.icon />
          </button>
        ))}
        <span className="rte__divider" />
        <button
          type="button" className="rte__btn" title="Insert link"
          onMouseDown={(e) => e.preventDefault()} onClick={() => run("link")}
        >
          <HiOutlineLink />
        </button>
        <button
          type="button" className="rte__btn" title="Clear formatting"
          onMouseDown={(e) => e.preventDefault()} onClick={() => run("clear")}
        >
          <HiOutlineBackspace />
        </button>
      </div>

      <div className="rte__body">
        {isEmpty && <span className="rte__placeholder">{placeholder}</span>}
        <div
          ref={ref}
          className="rte__editable"
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
        />
      </div>
    </div>
  );
}

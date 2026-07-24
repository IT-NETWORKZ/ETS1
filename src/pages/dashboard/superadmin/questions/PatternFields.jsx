import {
  HiOutlinePlus, HiOutlineTrash,
  HiOutlinePhoto, HiOutlineSpeakerWave, HiOutlineVideoCamera, HiOutlineXMark,
} from "react-icons/hi2";

function Field({ label, children, span }) {
  return (
    <label className={"qfield" + (span ? " qfield--span" : "")}>
      <span className="qfield__label">{label}</span>
      {children}
    </label>
  );
}

const MEDIA_TYPES = [
  { key: "image", label: "Add image", accept: "image/*", icon: HiOutlinePhoto },
  { key: "audio", label: "Add audio", accept: "audio/*", icon: HiOutlineSpeakerWave },
  { key: "video", label: "Add video", accept: "video/*", icon: HiOutlineVideoCamera },
];

function MediaAttach({ media, onChange, className }) {
  const m = media || { image: null, audio: null, video: null };

  const setFile = (key, file) => {
    if (!file) { onChange({ ...m, [key]: null }); return; }
    const reader = new FileReader();
    reader.onload = () => onChange({ ...m, [key]: { name: file.name, url: reader.result } });
    reader.readAsDataURL(file);
  };
  const clearFile = (key, e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange({ ...m, [key]: null });
  };

  return (
    <div className={"qmedia" + (className ? ` ${className}` : "")}>
      {MEDIA_TYPES.map(({ key, label, accept, icon: Icon }) => (
        <label key={key} className={"qmedia__btn" + (m[key] ? " qmedia__btn--filled" : "")}>
          <Icon />
          <span>{m[key]?.name || label}</span>
          <input type="file" accept={accept} hidden onChange={(e) => setFile(key, e.target.files[0])} />
          {m[key] && (
            <button type="button" className="qmedia__clear" onClick={(e) => clearFile(key, e)}>
              <HiOutlineXMark />
            </button>
          )}
        </label>
      ))}
    </div>
  );
}

export default function PatternFields({ draft, setDraft }) {
  const patch = (p) => setDraft((d) => ({ ...d, ...p }));

  const setOption = (i, text) => {
    const next = [...draft.options];
    next[i] = { ...next[i], text };
    patch({ options: next });
  };
  const setOptionMedia = (i, media) => {
    const next = [...draft.options];
    next[i] = { ...next[i], media };
    patch({ options: next });
  };
  const addOption = () => patch({ options: [...draft.options, { id: Date.now(), text: "", media: { image: null, audio: null, video: null } }] });
  const removeOption = (i) => patch({ options: draft.options.filter((_, idx) => idx !== i) });
  const setQuestionMedia = (media) => patch({ questionMedia: media });

  const toggleCorrect = (i) => {
    const set = new Set(draft.correctOptions || []);
    if (set.has(i)) set.delete(i); else set.add(i);
    patch({ correctOptions: [...set] });
  };

  return (
    <div className="qfields">
      <Field label="Question Text" span>
        <textarea
          rows={2}
          placeholder="Type the question text..."
          value={draft.questionText || ""}
          onChange={(e) => patch({ questionText: e.target.value })}
        />
        <MediaAttach className="qmedia--question" media={draft.questionMedia} onChange={setQuestionMedia} />
      </Field>

      <Field label="Options (mark all correct ones)" span>
        <div className="qoptions">
          {draft.options.map((opt, i) => (
            <div className="qoptionitem" key={opt.id}>
              <div className="qoption">
                <input
                  type="checkbox" checked={(draft.correctOptions || []).includes(i)}
                  onChange={() => toggleCorrect(i)}
                />
                <input
                  type="text" placeholder={`Option ${i + 1}`} value={opt.text}
                  onChange={(e) => setOption(i, e.target.value)}
                />
                {draft.options.length > 2 && (
                  <button type="button" className="qiconbtn" onClick={() => removeOption(i)}><HiOutlineTrash /></button>
                )}
              </div>
              <MediaAttach media={opt.media} onChange={(m) => setOptionMedia(i, m)} />
            </div>
          ))}
          <button type="button" className="qaddbtn" onClick={addOption}><HiOutlinePlus /> Add option</button>
        </div>
      </Field>
    </div>
  );
}
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowUpTray } from "react-icons/hi2";

function Field({ label, children, span }) {
  return (
    <label className={"qfield" + (span ? " qfield--span" : "")}>
      <span className="qfield__label">{label}</span>
      {children}
    </label>
  );
}

export default function PatternFields({ pattern, draft, setDraft }) {
  const patch = (p) => setDraft((d) => ({ ...d, ...p }));

  const setOption = (i, text) => {
    const next = [...draft.options];
    next[i] = { ...next[i], text };
    patch({ options: next });
  };
  const addOption = () => patch({ options: [...draft.options, { id: Date.now(), text: "" }] });
  const removeOption = (i) => patch({ options: draft.options.filter((_, idx) => idx !== i) });

  const toggleMultiCorrect = (i) => {
    const set = new Set(draft.correctOptions || []);
    if (set.has(i)) set.delete(i); else set.add(i);
    patch({ correctOptions: [...set] });
  };

  const addChildQuestion = () =>
    patch({ childQuestions: [...(draft.childQuestions || []), { id: Date.now(), text: "" }] });
  const setChildQuestion = (i, text) => {
    const next = [...draft.childQuestions];
    next[i] = { ...next[i], text };
    patch({ childQuestions: next });
  };
  const removeChildQuestion = (i) =>
    patch({ childQuestions: draft.childQuestions.filter((_, idx) => idx !== i) });

  return (
    <div className="qfields">
      <Field label="Question Text" span>
        <textarea
          rows={2}
          placeholder="Type the question text..."
          value={draft.questionText || ""}
          onChange={(e) => patch({ questionText: e.target.value })}
        />
      </Field>

      {(pattern === "single" || pattern === "multi") && (
        <Field label={pattern === "single" ? "Options (mark the correct one)" : "Options (mark all correct ones)"} span>
          <div className="qoptions">
            {draft.options.map((opt, i) => (
              <div className="qoption" key={opt.id}>
                {pattern === "single" ? (
                  <input
                    type="radio" name="correctOption" checked={draft.correctOption === i}
                    onChange={() => patch({ correctOption: i })}
                  />
                ) : (
                  <input
                    type="checkbox" checked={(draft.correctOptions || []).includes(i)}
                    onChange={() => toggleMultiCorrect(i)}
                  />
                )}
                <input
                  type="text" placeholder={`Option ${i + 1}`} value={opt.text}
                  onChange={(e) => setOption(i, e.target.value)}
                />
                {draft.options.length > 2 && (
                  <button type="button" className="qiconbtn" onClick={() => removeOption(i)}><HiOutlineTrash /></button>
                )}
              </div>
            ))}
            <button type="button" className="qaddbtn" onClick={addOption}><HiOutlinePlus /> Add option</button>
          </div>
        </Field>
      )}

      {pattern === "truefalse" && (
        <Field label="Correct Answer" span>
          <div className="qtf">
            <label><input type="radio" name="tf" checked={draft.tfAnswer === true} onChange={() => patch({ tfAnswer: true })} /> True</label>
            <label><input type="radio" name="tf" checked={draft.tfAnswer === false} onChange={() => patch({ tfAnswer: false })} /> False</label>
          </div>
        </Field>
      )}

      {pattern === "descriptive" && (
        <>
          <Field label="Word Limit">
            <input type="number" min="0" placeholder="e.g. 250" value={draft.wordLimit || ""} onChange={(e) => patch({ wordLimit: e.target.value })} />
          </Field>
          <Field label="Evaluation Rubric" span>
            <textarea rows={2} placeholder="Key points markers should look for..." value={draft.rubric || ""} onChange={(e) => patch({ rubric: e.target.value })} />
          </Field>
        </>
      )}

      {pattern === "media" && (
        <>
          <Field label="Media Type">
            <select value={draft.mediaType || "image"} onChange={(e) => patch({ mediaType: e.target.value })}>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </Field>
          <Field label="Alt Text / Transcript Note">
            <input type="text" placeholder="Describes the media for accessibility" value={draft.altText || ""} onChange={(e) => patch({ altText: e.target.value })} />
          </Field>
          <Field label="Attach Media File" span>
            <div className="qfileupload">
              <HiOutlineArrowUpTray />
              <input type="file" accept="image/*,audio/*,video/*" onChange={(e) => patch({ mediaFileName: e.target.files[0]?.name || "" })} />
              <span>{draft.mediaFileName || "No file selected"}</span>
            </div>
          </Field>
        </>
      )}

      {pattern === "passage" && (
        <>
          <Field label="Shared Passage / Case Study Text" span>
            <textarea rows={3} placeholder="Paste the passage or case study here..." value={draft.passageText || ""} onChange={(e) => patch({ passageText: e.target.value })} />
          </Field>
          <Field label="Child Questions" span>
            <div className="qoptions">
              {(draft.childQuestions || []).map((cq, i) => (
                <div className="qoption" key={cq.id}>
                  <span className="qoption__num">{i + 1}</span>
                  <input type="text" placeholder={`Child question ${i + 1}`} value={cq.text} onChange={(e) => setChildQuestion(i, e.target.value)} />
                  <button type="button" className="qiconbtn" onClick={() => removeChildQuestion(i)}><HiOutlineTrash /></button>
                </div>
              ))}
              <button type="button" className="qaddbtn" onClick={addChildQuestion}><HiOutlinePlus /> Add child question</button>
            </div>
          </Field>
        </>
      )}

      {pattern === "upload" && (
        <>
          <Field label="Allowed File Types">
            <input type="text" placeholder="e.g. .pdf, .docx, .zip" value={draft.allowedTypes || ""} onChange={(e) => patch({ allowedTypes: e.target.value })} />
          </Field>
          <Field label="Max File Size (MB)">
            <input type="number" min="1" placeholder="e.g. 20" value={draft.maxSizeMb || ""} onChange={(e) => patch({ maxSizeMb: e.target.value })} />
          </Field>
        </>
      )}
    </div>
  );
}

import { HiOutlineCheck } from "react-icons/hi2";
import "./QuestionAnswerView.css";

// Patterns that have their own dedicated (non-options) answer view.
// Anything else — including drafts with no `pattern` set at all, which is
// what the simplified candidate/admin/superadmin builder now produces —
// falls through to the options list below.
const NON_OPTION_PATTERNS = ["truefalse", "descriptive", "media", "passage", "upload"];

function MediaPreview({ media }) {
  if (!media) return null;
  const { image, audio, video } = media;
  if (!image && !audio && !video) return null;

  return (
    <div className="qav__media">
      {image && (
        <div className="qav__mediaitem">
          <img src={image.url} alt={image.name || "attached image"} className="qav__mediaimg" />
        </div>
      )}
      {audio && (
        <div className="qav__mediaitem">
          <audio controls src={audio.url} className="qav__mediaaudio" />
          <span className="qav__medianame">{audio.name}</span>
        </div>
      )}
      {video && (
        <div className="qav__mediaitem">
          <video controls src={video.url} className="qav__mediavideo" />
          <span className="qav__medianame">{video.name}</span>
        </div>
      )}
    </div>
  );
}

// Renders a question's text + its answer/config in a read-only way, for any
// of the 7 admin-authored patterns as well as the simplified media-attach
// builder shared by candidate/admin/superadmin. Used by both the "saved
// questions" popup and the submitted-table preview modal.
export default function QuestionAnswerView({ q, patternMeta }) {
  const showOptions = !NON_OPTION_PATTERNS.includes(q.pattern) && (q.options || []).length > 0;

  return (
    <div className="qav">
      {patternMeta && (
        <span className="qav__patterntag"><patternMeta.icon /> {patternMeta.label}</span>
      )}

      <div className="qav__question">{q.questionText || <em>No question text</em>}</div>
      <MediaPreview media={q.questionMedia} />

      {showOptions && (
        <ul className="qav__options">
          {(q.options || []).map((opt, i) => {
            const isCorrect = q.correctOption != null
              ? q.correctOption === i
              : (q.correctOptions || []).includes(i);
            return (
              <li key={opt.id ?? i} className={"qav__option" + (isCorrect ? " qav__option--correct" : "")}>
                <span className="qav__optionletter">{String.fromCharCode(65 + i)}</span>
                <div className="qav__optionbody">
                  <span>{opt.text || <em>Empty option</em>}</span>
                  <MediaPreview media={opt.media} />
                </div>
                {isCorrect && <HiOutlineCheck className="qav__optioncheck" />}
              </li>
            );
          })}
        </ul>
      )}

      {q.pattern === "truefalse" && (
        <div className="qav__answerline">
          Correct answer: <strong>{q.tfAnswer === true ? "True" : q.tfAnswer === false ? "False" : "Not set"}</strong>
        </div>
      )}

      {q.pattern === "descriptive" && (
        <div className="qav__answerline">
          {q.wordLimit && <div>Word limit: <strong>{q.wordLimit}</strong></div>}
          <div>Evaluation rubric: {q.rubric || <em>Not provided</em>}</div>
        </div>
      )}

      {q.pattern === "media" && (
        <div className="qav__answerline">
          <div>Media type: <strong>{q.mediaType || "image"}</strong></div>
          {q.altText && <div>Alt text: {q.altText}</div>}
          <div>File: {q.mediaFile?.name || q.mediaFileName || <em>No file attached</em>}</div>
          <MediaPreview media={{ [q.mediaType || "image"]: q.mediaFile }} />
        </div>
      )}

      {q.pattern === "passage" && (
        <div className="qav__answerline">
          <div className="qav__passage">{q.passageText || <em>No passage text</em>}</div>
          {(q.childQuestions || []).length > 0 && (
            <ol className="qav__children">
              {q.childQuestions.map((cq) => <li key={cq.id}>{cq.text || <em>Empty</em>}</li>)}
            </ol>
          )}
        </div>
      )}

      {q.pattern === "upload" && (
        <div className="qav__answerline">
          <div>Allowed file types: {q.allowedTypes || <em>Not set</em>}</div>
          <div>Max file size: {q.maxSizeMb ? `${q.maxSizeMb} MB` : <em>Not set</em>}</div>
        </div>
      )}
    </div>
  );
}

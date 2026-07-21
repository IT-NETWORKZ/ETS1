import { HiOutlineCheck } from "react-icons/hi2";

// Renders a question's text + its answer/config in a read-only way, for any
// of the 7 question patterns. Used by both the "saved questions" popup and
// the submitted-table preview modal.
export default function QuestionAnswerView({ q, patternMeta }) {
  return (
    <div className="qav">
      {patternMeta && (
        <span className="qav__patterntag"><patternMeta.icon /> {patternMeta.label}</span>
      )}

      <div className="qav__question">{q.questionText || <em>No question text</em>}</div>

      {(q.pattern === "single" || q.pattern === "multi") && (
        <ul className="qav__options">
          {(q.options || []).map((opt, i) => {
            const isCorrect = q.pattern === "single"
              ? q.correctOption === i
              : (q.correctOptions || []).includes(i);
            return (
              <li key={opt.id ?? i} className={"qav__option" + (isCorrect ? " qav__option--correct" : "")}>
                <span className="qav__optionletter">{String.fromCharCode(65 + i)}</span>
                <span>{opt.text || <em>Empty option</em>}</span>
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
          <div>File: {q.mediaFileName || <em>No file attached</em>}</div>
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

import * as XLSX from "xlsx";

// Shared by admin / superadmin / candidate Question Bank pages so the
// Excel sample + upload/validate behaviour stays identical everywhere.

export const EXCEL_HEADERS = [
  "Subject", "Topic", "Difficulty", "Marks", "Negative Marks", "Language",
  "Question Text",
  "Question Image URL", "Question Audio URL", "Question Video URL",
  "Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6",
  "Correct Option(s)",
];

const DIFFICULTIES = ["Basic", "Moderate", "Hard", "Advanced"];
const LANGUAGES = ["English", "Hindi", "Marathi"];

/** Turns a "Question Image/Audio/Video URL" cell into the {name, url} shape MediaAttach/MediaPreview expect. */
function mediaFromUrl(rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url) return null;
  let name = "Attached file";
  try {
    const path = new URL(url).pathname;
    const last = path.split("/").filter(Boolean).pop();
    if (last) name = decodeURIComponent(last);
  } catch {
    /* not a valid absolute URL — keep the generic name, still usable as a src */
  }
  return { name, url };
}

/** Triggers a download of an empty .xlsx template — just the header row, ready to fill in. */
export function downloadSampleExcel(filename = "question-bank-sample.xlsx") {
  const wb = XLSX.utils.book_new();

  const wsQuestions = XLSX.utils.aoa_to_sheet([EXCEL_HEADERS]);
  wsQuestions["!cols"] = EXCEL_HEADERS.map((h) => ({
    wch: h === "Question Text" ? 45 : Math.max(14, h.length + 2),
  }));
  wsQuestions["!ref"] = `A1:${XLSX.utils.encode_col(EXCEL_HEADERS.length - 1)}1`;
  XLSX.utils.book_append_sheet(wb, wsQuestions, "Questions");

  XLSX.writeFile(wb, filename);
}

/**
 * Parses an uploaded .xls/.xlsx File into question-bank drafts (same shape the
 * manual form produces), plus a list of row-level errors for anything skipped.
 * Returns a Promise<{ valid: DraftQuestion[], errors: { row: number, message: string }[] }>
 */
export function parseQuestionExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const sheetName = wb.SheetNames.find((n) => n.toLowerCase() !== "instructions") || wb.SheetNames[0];
        const sheet = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const valid = [];
        const errors = [];

        rows.forEach((row, idx) => {
          const excelRowNum = idx + 2; // header is row 1
          const questionText = String(row["Question Text"] || "").trim();

          // Skip fully blank rows silently (common at the end of a sheet)
          const hasAnyValue = Object.values(row).some((v) => String(v).trim() !== "");
          if (!hasAnyValue) return;

          if (!questionText) {
            errors.push({ row: excelRowNum, message: "Question Text is missing." });
            return;
          }

          const optionTexts = [];
          for (let i = 1; i <= 8; i++) {
            const v = row[`Option ${i}`];
            if (v !== undefined && String(v).trim() !== "") optionTexts.push(String(v).trim());
          }
          if (optionTexts.length < 2) {
            errors.push({ row: excelRowNum, message: "Needs at least 2 options (Option 1, Option 2, ...)." });
            return;
          }

          const correctRaw = String(row["Correct Option(s)"] || "").trim();
          if (!correctRaw) {
            errors.push({ row: excelRowNum, message: "Correct Option(s) is missing, e.g. 2 or 1,3." });
            return;
          }
          const correctOptions = [...new Set(
            correctRaw.split(/[,\s]+/).filter(Boolean).map((n) => parseInt(n, 10) - 1)
          )];
          const invalidIndex = correctOptions.some((i) => Number.isNaN(i) || i < 0 || i >= optionTexts.length);
          if (invalidIndex) {
            errors.push({ row: excelRowNum, message: `Correct Option(s) "${correctRaw}" doesn't match the option numbers filled in.` });
            return;
          }

          const difficultyRaw = String(row["Difficulty"] || "").trim();
          const difficulty = DIFFICULTIES.find((d) => d.toLowerCase() === difficultyRaw.toLowerCase()) || "Moderate";

          const languageRaw = String(row["Language"] || "").trim();
          const language = LANGUAGES.find((l) => l.toLowerCase() === languageRaw.toLowerCase()) || "English";

          const marksNum = parseFloat(row["Marks"]);
          const negMarksNum = parseFloat(row["Negative Marks"]);

          valid.push({
            id: null,
            subject: String(row["Subject"] || "").trim(),
            topic: String(row["Topic"] || "").trim(),
            difficulty,
            marks: Number.isFinite(marksNum) ? String(marksNum) : "1",
            negMarks: Number.isFinite(negMarksNum) ? String(negMarksNum) : "0",
            language,
            questionText,
            questionMedia: {
              image: mediaFromUrl(row["Question Image URL"]),
              audio: mediaFromUrl(row["Question Audio URL"]),
              video: mediaFromUrl(row["Question Video URL"]),
            },
            options: optionTexts.map((text, i) => ({
              id: Date.now() + idx * 10 + i,
              text,
              media: { image: null, audio: null, video: null },
            })),
            correctOptions,
            _fromExcel: true,
          });
        });

        resolve({ valid, errors });
      } catch (err) {
        reject(new Error("This doesn't look like a valid .xls/.xlsx file."));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// Shared by every exam runner (Demo, Quick Practice, Custom Practice, Public/Open)
// so "shuffle questions every attempt" behaves identically everywhere.

/**
 * Returns a new array with the same items in a random order (Fisher–Yates).
 * Never mutates the input array. Called once per attempt (e.g. inside
 * startExam()), not on every render, so the order stays stable while a
 * candidate is answering but is freshly randomized on the next attempt —
 * which is also what makes two candidates starting at the same time see
 * different orders, since each browser session shuffles independently.
 */
export function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

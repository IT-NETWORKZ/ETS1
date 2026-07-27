// Simple shared feedback store.
// Persists to localStorage so Candidate/Admin submissions are visible to
// Superadmin immediately (and survive a refresh). Swap the internals of
// these functions for real API calls later — the function signatures
// (addFeedback / getFeedback / updateFeedbackStatus / subscribeFeedback)
// are written so pages don't need to change when that happens.

import { useEffect, useState } from "react";

const STORAGE_KEY = "exam_feedback_v1";
const EVENT_NAME = "feedback-store-updated";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT_NAME));
}

/**
 * role: "candidate" | "admin"
 * payload: { name, message, rating, image (dataURL|null) }
 */
export function addFeedback(role, payload) {
  const list = readAll();
  const entry = {
    id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
    role,
    name: payload.name,
    message: payload.message,
    rating: payload.rating,
    image: payload.image || null,
    date: new Date().toISOString(),
    status: "New",
  };
  list.unshift(entry);
  writeAll(list);
  return entry;
}

export function getFeedback(role) {
  return readAll()
    .filter((f) => f.role === role)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function updateFeedbackStatus(id, status) {
  const list = readAll();
  const idx = list.findIndex((f) => f.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    writeAll(list);
  }
}

export function subscribeFeedback(callback) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

// Live, role-filtered feedback list — used by the Superadmin feedback tables.
export function useFeedbackList(role) {
  const [records, setRecords] = useState(() => getFeedback(role));
  useEffect(() => subscribeFeedback(() => setRecords(getFeedback(role))), [role]);
  return records;
}

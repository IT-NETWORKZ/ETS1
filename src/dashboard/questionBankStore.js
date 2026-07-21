import { useEffect, useState } from "react";

const EVENT_PREFIX = "questionBankUpdated:";

function readAll(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(storageKey, records) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(records));
  } catch {
    /* localStorage unavailable — records stay in-memory for this session only */
  }
  window.dispatchEvent(new CustomEvent(EVENT_PREFIX + storageKey));
}

function subscribe(storageKey, callback) {
  const eventName = EVENT_PREFIX + storageKey;
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener("storage", callback);
  };
}

/**
 * Creates an independent, localStorage-backed question-bank record store.
 * Each dashboard (admin / superadmin / candidate) creates its own instance
 * with a distinct storageKey so their submitted tables never mix.
 */
export function createQuestionBankStore(storageKey) {
  function list() {
    return readAll(storageKey).sort((a, b) => b.createdAt - a.createdAt);
  }

  // Commits a batch of session drafts as permanent, submitted records.
  function addMany(records) {
    const all = readAll(storageKey);
    const next = [...all, ...records];
    writeAll(storageKey, next);
    return next;
  }

  function setStatus(id, status) {
    const all = readAll(storageKey);
    writeAll(storageKey, all.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function update(id, patch) {
    const all = readAll(storageKey);
    writeAll(storageKey, all.map((r) => (r.id === id ? { ...r, ...patch, id, updatedAt: Date.now() } : r)));
  }

  function remove(id) {
    writeAll(storageKey, readAll(storageKey).filter((r) => r.id !== id));
  }

  function useList() {
    const [records, setRecords] = useState(list);
    useEffect(() => subscribe(storageKey, () => setRecords(list())), []);
    return records;
  }

  return { list, addMany, setStatus, update, remove, useList };
}

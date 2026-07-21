import { useEffect, useState } from "react";

const STORAGE_KEY = "categoryRecords_v1";
const EVENT_NAME = "categoryUpdated";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* localStorage unavailable — records stay in-memory for this session only */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function listCategories() {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function addCategory(name) {
  const all = readAll();
  const record = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    createdAt: Date.now(),
    status: "enabled",
  };
  writeAll([...all, record]);
  return record;
}

export function setCategoryStatus(id, status) {
  const all = readAll();
  writeAll(all.map((r) => (r.id === id ? { ...r, status } : r)));
}

export function deleteCategory(id) {
  writeAll(readAll().filter((r) => r.id !== id));
}

function subscribe(callback) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

// Full, live list of every category — used by the Add Category table.
export function useCategoryList() {
  const [records, setRecords] = useState(listCategories);
  useEffect(() => subscribe(() => setRecords(listCategories())), []);
  return records;
}
